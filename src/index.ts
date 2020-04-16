import get from 'lodash.get'
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { REG_EXP_EMAIL, RULE_EMAIL } from './const'

export type ValidatorRuleType = number | RegExp
export type FieldType = number | string;

@Injectable()
export default class NestjsGraphqlValidator implements PipeTransform {

	validators: { [key: string]: (field: any, validatorValue: any, propertyPath?: string) => boolean } = {
		// string
		maxLen: this.maxLenValidator,
		minLen: this.minLenValidator,
		// numbers
		min: this.minValidator,
		max: this.maxValidator,
		regExp: this.regExpValidator,
		rules: this.rulesValidator,
	}

	constructor(private schema: any) { }

	private maxLenValidator(field: string, validatorValue: ValidatorRuleType, propertyPath?: string) {
		const fieldToCheck = propertyPath ? get(field, propertyPath) : field
		return fieldToCheck.length <= validatorValue
	}

	private minLenValidator(field: string, validatorValue: ValidatorRuleType, propertyPath?: string) {
		const fieldToCheck = propertyPath ? get(field, propertyPath) : field
		return fieldToCheck.length >= validatorValue
	}

	private minValidator(field: number, validatorValue: ValidatorRuleType, propertyPath?: string) {
		const fieldToCheck = propertyPath ? get(field, propertyPath) : field
		return fieldToCheck >= validatorValue
	}

	private maxValidator(field: number, validatorValue: ValidatorRuleType, propertyPath?: string) {
		const fieldToCheck = propertyPath ? get(field, propertyPath) : field
		return fieldToCheck <= validatorValue
	}

	private regExpValidator(field: string, validatorValue: RegExp, propertyPath?: string) {
		const fieldToCheck = propertyPath ? get(field, propertyPath) : field
		return new RegExp(validatorValue).test(fieldToCheck)
	}

	private rulesValidator(field: string, rules: string[], propertyPath?: string) {
		const fieldToCheck = propertyPath ? get(field, propertyPath) : field

		for (const rule of rules) {
			let isValidRule = false
			if (rule === RULE_EMAIL) {
				isValidRule = new RegExp(REG_EXP_EMAIL).test(fieldToCheck)
			} else {
				console.error(`Unsuppported rule ${rule}`)
			}

			if (!isValidRule) return false
		}
		return true
	}

	transform(value: any, metadata: ArgumentMetadata): any {
		if (!metadata || !metadata.data) return value;

		const schemaKey = metadata.data;

		const splitPath = schemaKey.split('_'); // is nested ?
		let propertyPath = undefined;

		if (splitPath.length > 1) {
			const rest = splitPath.slice(1); // skip first
			propertyPath = rest.join('.');
		}

		if (!this.schema[schemaKey]) return value
		for (const insideSchemaKey of Object.keys(this.schema[schemaKey])) {
			if (this.validators[insideSchemaKey]) {
				var isValid = this.validators[insideSchemaKey](value, this.schema[schemaKey][insideSchemaKey], propertyPath);

				if (!isValid) {
					let errMsg = null;
					if (this.schema[schemaKey].customError) {
						errMsg = this.schema[schemaKey].customError;
					}
					else {
						errMsg = `Validation failed for property ${metadata.data}, rules: ${insideSchemaKey}#${schemaKey}#${this.schema[schemaKey][insideSchemaKey]}`;
					}
					throw new BadRequestException(errMsg);
				}
			} else if (insideSchemaKey !== 'customError') {
				console.error(`Unsuppported chema key ${insideSchemaKey}`);
			}

		}
		return value;
	}
}
