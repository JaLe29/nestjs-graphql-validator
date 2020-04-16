import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { REG_EXP_EMAIL, RULE_EMAIL } from './const'

export type ValidatorRuleType = number | RegExp
export type FieldType = number | string;

@Injectable()
export default class JoiValidationPipe implements PipeTransform {

	validators: { [key: string]: (field: any, validatorValue: any) => boolean } = {
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

	private maxLenValidator(field: string, validatorValue: ValidatorRuleType) {
		return field.length <= validatorValue
	}

	private minLenValidator(field: string, validatorValue: ValidatorRuleType) {
		return field.length >= validatorValue
	}

	private minValidator(field: number, validatorValue: ValidatorRuleType) {
		return field >= validatorValue
	}

	private maxValidator(field: number, validatorValue: ValidatorRuleType) {
		return field <= validatorValue
	}

	private regExpValidator(field: string, validatorValue: RegExp) {
		return new RegExp(validatorValue).test(field)
	}

	private rulesValidator(field: string, rules: string[]) {
		for (const rule of rules) {
			let isValidRule = false
			if (rule === RULE_EMAIL) {
				isValidRule = this.regExpValidator(field, REG_EXP_EMAIL)
			} else {
				console.error(`Unsuppported rule ${rule}`)
			}

			if (!isValidRule) return false
		}
		return true
	}

	transform(value: any, metadata: ArgumentMetadata): any {
		if (metadata && metadata.data && this.schema[metadata.data]) {
			for (const key of Object.keys(this.schema[metadata.data])) {
				const schemaKey: string = key

				if (this.validators[schemaKey]) {
					const isValid = this.validators[schemaKey](value, this.schema[metadata.data][schemaKey])
					if (!isValid) {
						let errMsg = null
						if (this.schema[metadata.data].customError) errMsg = this.schema[metadata.data].customError
						else errMsg = `Validation failed for property ${metadata.data}, rules: ${schemaKey}#${this.schema[metadata.data][schemaKey]}`
						throw new BadRequestException(errMsg)
					}
				} else {
					console.error(`Unsuppported chema key ${schemaKey}`)
				}
			}
		}
		return value
	}
}
