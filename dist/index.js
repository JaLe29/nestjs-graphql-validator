"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var common_1 = require("@nestjs/common");
var JoiValidationPipe = /** @class */ (function () {
    function JoiValidationPipe(schema) {
        this.schema = schema;
        this.validators = {
            // string
            maxLen: this.maxLenValidator,
            minLen: this.minLenValidator,
            // numbers
            min: this.minValidator,
            max: this.maxValidator,
            regExp: this.regExpValidator,
        };
    }
    JoiValidationPipe.prototype.maxLenValidator = function (field, validatorValue) {
        console.log(field, validatorValue);
        return field.length <= validatorValue;
    };
    JoiValidationPipe.prototype.minLenValidator = function (field, validatorValue) {
        return field.length >= validatorValue;
    };
    JoiValidationPipe.prototype.minValidator = function (field, validatorValue) {
        return field >= validatorValue;
    };
    JoiValidationPipe.prototype.maxValidator = function (field, validatorValue) {
        return field <= validatorValue;
    };
    JoiValidationPipe.prototype.regExpValidator = function (field, validatorValue) {
        return new RegExp(validatorValue).test(field);
    };
    JoiValidationPipe.prototype.transform = function (value, metadata) {
        if (this.schema[metadata.data]) {
            for (var _i = 0, _a = Object.keys(this.schema[metadata.data]); _i < _a.length; _i++) {
                var schemaKey = _a[_i];
                if (this.validators[schemaKey]) {
                    var isValid = this.validators[schemaKey](value, this.schema[metadata.data][schemaKey]);
                    if (!isValid) {
                        var errMsg = null;
                        if (this.schema[metadata.data].customError)
                            errMsg = this.schema[metadata.data].customError;
                        else
                            errMsg = "Validation failed for property " + metadata.data + ", rules: " + schemaKey + "#" + this.schema[metadata.data][schemaKey];
                        throw new common_1.BadRequestException(errMsg);
                    }
                }
                else {
                    console.error("Unsuppported chema key " + schemaKey);
                }
            }
        }
        return value;
    };
    JoiValidationPipe = __decorate([
        common_1.Injectable()
    ], JoiValidationPipe);
    return JoiValidationPipe;
}());
exports.default = JoiValidationPipe;
//# sourceMappingURL=index.js.map