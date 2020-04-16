// @ts-nocheck
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'

@Injectable()
export default class JoiValidationPipe implements PipeTransform {

	validators: any = {
		// string
		maxLen: this.maxLenValidator,
		minLen: this.minLenValidator,
		// numbers
		min: this.minValidator,
		max: this.maxValidator,
		regExp: this.regExpValidator,
	}

	constructor(private schema: any) { }

	private maxLenValidator(field: string, validatorValue: any) {
		console.log(field, validatorValue)
		return field.length <= validatorValue
	}

	private minLenValidator(field: string, validatorValue: any) {
		return field.length >= validatorValue
	}

	private minValidator(field: any, validatorValue: any) {
		return field >= validatorValue
	}

	private maxValidator(field: any, validatorValue: any) {
		return field <= validatorValue
	}

	private regExpValidator(field: any, validatorValue: any) {
		return new RegExp(validatorValue).test(field)
	}

	transform(value: any, metadata: ArgumentMetadata) {
		if (this.schema[metadata.data]) {
			for (const schemaKey of Object.keys(this.schema[metadata.data])) {
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
