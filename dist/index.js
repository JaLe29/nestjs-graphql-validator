"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@nestjs/common");
var const_1 = require("./const");
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
            rules: this.rulesValidator,
        };
    }
    JoiValidationPipe.prototype.maxLenValidator = function (field, validatorValue) {
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
    JoiValidationPipe.prototype.rulesValidator = function (field, rules) {
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            var isValidRule = false;
            if (rule === const_1.RULE_EMAIL) {
                isValidRule = this.regExpValidator(field, const_1.REG_EXP_EMAIL);
            }
            else {
                console.error("Unsuppported rule " + rule);
            }
            if (!isValidRule)
                return false;
        }
        return true;
    };
    JoiValidationPipe.prototype.transform = function (value, metadata) {
        if (metadata && metadata.data && this.schema[metadata.data]) {
            for (var _i = 0, _a = Object.keys(this.schema[metadata.data]); _i < _a.length; _i++) {
                var key = _a[_i];
                var schemaKey = key;
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