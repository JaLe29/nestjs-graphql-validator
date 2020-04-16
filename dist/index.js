"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_get_1 = __importDefault(require("lodash.get"));
var common_1 = require("@nestjs/common");
var const_1 = require("./const");
var NestjsGraphqlValidator = /** @class */ (function () {
    function NestjsGraphqlValidator(schema) {
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
    NestjsGraphqlValidator.prototype.maxLenValidator = function (field, validatorValue, propertyPath) {
        var fieldToCheck = propertyPath ? lodash_get_1.default(field, propertyPath) : field;
        return fieldToCheck.length <= validatorValue;
    };
    NestjsGraphqlValidator.prototype.minLenValidator = function (field, validatorValue, propertyPath) {
        var fieldToCheck = propertyPath ? lodash_get_1.default(field, propertyPath) : field;
        return fieldToCheck.length >= validatorValue;
    };
    NestjsGraphqlValidator.prototype.minValidator = function (field, validatorValue, propertyPath) {
        var fieldToCheck = propertyPath ? lodash_get_1.default(field, propertyPath) : field;
        return fieldToCheck >= validatorValue;
    };
    NestjsGraphqlValidator.prototype.maxValidator = function (field, validatorValue, propertyPath) {
        var fieldToCheck = propertyPath ? lodash_get_1.default(field, propertyPath) : field;
        return fieldToCheck <= validatorValue;
    };
    NestjsGraphqlValidator.prototype.regExpValidator = function (field, validatorValue, propertyPath) {
        var fieldToCheck = propertyPath ? lodash_get_1.default(field, propertyPath) : field;
        return new RegExp(validatorValue).test(fieldToCheck);
    };
    NestjsGraphqlValidator.prototype.rulesValidator = function (field, rules, propertyPath) {
        var fieldToCheck = propertyPath ? lodash_get_1.default(field, propertyPath) : field;
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            var isValidRule = false;
            if (rule === const_1.RULE_EMAIL) {
                isValidRule = new RegExp(const_1.REG_EXP_EMAIL).test(fieldToCheck);
            }
            else {
                console.error("Unsuppported rule " + rule);
            }
            if (!isValidRule)
                return false;
        }
        return true;
    };
    NestjsGraphqlValidator.prototype.transform = function (value, metadata) {
        if (!metadata || !metadata.data)
            return value;
        var schemaKey = metadata.data;
        var splitPath = schemaKey.split('_'); // is nested ?
        var propertyPath = undefined;
        if (splitPath.length > 1) {
            var rest = splitPath.slice(1); // skip first
            propertyPath = rest.join('.');
        }
        if (!this.schema[schemaKey])
            return value;
        for (var _i = 0, _a = Object.keys(this.schema[schemaKey]); _i < _a.length; _i++) {
            var insideSchemaKey = _a[_i];
            if (this.validators[insideSchemaKey]) {
                var isValid = this.validators[insideSchemaKey](value, this.schema[schemaKey][insideSchemaKey], propertyPath);
                if (!isValid) {
                    var errMsg = null;
                    if (this.schema[schemaKey].customError) {
                        errMsg = this.schema[schemaKey].customError;
                    }
                    else {
                        errMsg = "Validation failed for property " + metadata.data + ", rules: " + insideSchemaKey + "#" + schemaKey + "#" + this.schema[schemaKey][insideSchemaKey];
                    }
                    throw new common_1.BadRequestException(errMsg);
                }
            }
            else {
                console.error("Unsuppported chema key " + schemaKey);
            }
        }
        return value;
    };
    NestjsGraphqlValidator = __decorate([
        common_1.Injectable()
    ], NestjsGraphqlValidator);
    return NestjsGraphqlValidator;
}());
exports.default = NestjsGraphqlValidator;
//# sourceMappingURL=index.js.map