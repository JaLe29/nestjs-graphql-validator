import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare type ValidatorRuleType = number | RegExp;
export declare type FieldType = number | string;
export default class JoiValidationPipe implements PipeTransform {
    private schema;
    validators: {
        [key: string]: (field: any, validatorValue: any) => boolean;
    };
    constructor(schema: any);
    private maxLenValidator;
    private minLenValidator;
    private minValidator;
    private maxValidator;
    private regExpValidator;
    private rulesValidator;
    transform(value: any, metadata: ArgumentMetadata): any;
}
