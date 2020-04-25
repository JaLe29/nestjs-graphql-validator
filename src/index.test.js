import NestjsGraphqlValidator from './index'
import {BadRequestException} from '@nestjs/common'
import {REG_EXP_EMAIL} from './const'

describe('minLen & maxLen', () => {
	test('should throw error for wrong minLen', () => {
		const validator = new NestjsGraphqlValidator({email: {minLen: 10}})

		try {
			validator.transform('foo@foo.foo', {data: 'email'})
		} catch (e) {
			expect(e.message).toBe('Validation failed for property email, rules: minLen#email#10')
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should throw error for wrong maxLen', () => {
		const validator = new NestjsGraphqlValidator({email: {maxLen: 10}})

		try {
			validator.transform('loooooooooooooooongfoo@foo.foo', {data: 'email'})
		} catch (e) {
			expect(e.message).toBe('Validation failed for property email, rules: maxLen#email#10')
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should be successful', () => {
		const validator = new NestjsGraphqlValidator({email: {minLen: 10, maxLen: 100}})
		expect(validator.transform('foo@foo.foo', {data: 'email'})).toBe('foo@foo.foo')
	})

	test('should be successful for multifields', () => {
		const validator = new NestjsGraphqlValidator({email: {minLen: 10, maxLen: 100}, foo: {minLen: 10, maxLen: 100}, foo: {minLen: 10, maxLen: 100}})
		expect(validator.transform('foo@foo.foo', {data: 'email'})).toBe('foo@foo.foo')
	})
})

describe('min & max', () => {
	test('should throw error for wrong min', () => {
		const validator = new NestjsGraphqlValidator({someNumber: {min: 10}})

		try {
			validator.transform(5, {data: 'someNumber'})
		} catch (e) {
			expect(e.message).toBe('Validation failed for property someNumber, rules: min#someNumber#10')
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should throw error for wrong max', () => {
		const validator = new NestjsGraphqlValidator({someNumber: {min: 10}})

		try {
			validator.transform(12, {data: 'someNumber'})
		} catch (e) {
			expect(e.message).toBe('Validation failed for property someNumber, rules: max#someNumber#10')
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should be successful', () => {
		const validator = new NestjsGraphqlValidator({someNumber: {min: 10, max: 100}})
		expect(validator.transform(12, {data: 'someNumber'})).toBe(12)
	})

	test('should be successful for multifields', () => {
		const validator = new NestjsGraphqlValidator({someNumber: {min: 10, max: 100}, foo: {minLen: 10, maxLen: 100}, foo: {minLen: 10, maxLen: 100}})
		expect(validator.transform(12, {data: 'someNumber'})).toBe(12)
	})
})

describe('rules', () => {
	test('should throw error for wrong email', () => {
		const validator = new NestjsGraphqlValidator({email: {rules: ['isEmail']}})

		try {
			validator.transform('thisisnotemail', {data: 'email'})
		} catch (e) {
			expect(e.message).toBe('Validation failed for property email, rules: rules#email#isEmail')
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should be successful for email', () => {
		const validator = new NestjsGraphqlValidator({email: {rules: ['isEmail']}})
		expect(validator.transform('thisis@email.com', {data: 'email'})).toBe('thisis@email.com')
	})
})

describe('nested', () => {
	test('should throw error for wrong email', () => {
		const validator = new NestjsGraphqlValidator({data_email: {rules: ['isEmail']}})

		try {
			validator.transform({data: {email: 'thisisnotemail'}}, {data: 'data'})
		} catch (e) {
			expect(e.message).toBe('Validation failed for property data_email, rules: rules#data_email#isEmail')
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should be successful for email', () => {
		const validator = new NestjsGraphqlValidator({data_email: {rules: ['isEmail']}})

		const payload = {data: {email: 'thisis@email.com'}}
		expect(validator.transform(payload, {data: 'data'})).toEqual(payload)
	})

})

describe('regExp', () => {
	test('should throw error for wrong email', () => {
		const validator = new NestjsGraphqlValidator({email: {regExp: REG_EXP_EMAIL}})

		try {
			validator.transform('thisisnotemail', {data: 'email'})
		} catch (e) {
			expect(e.message).toBe(`Validation failed for property email, rules: regExp#email#${REG_EXP_EMAIL}`)
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should be successful for email', () => {
		const validator = new NestjsGraphqlValidator({email: {regExp: REG_EXP_EMAIL}})
		expect(validator.transform('thisis@email.com', {data: 'email'})).toEqual('thisis@email.com')
	})
})

describe('other', () => {
	test('should throw custom error for wrong max', () => {
		const validator = new NestjsGraphqlValidator({someNumber: {min: 10, customError: 'How are you'}})

		try {
			validator.transform(12, {data: 'someNumber'})
		} catch (e) {
			expect(e.message).toBe('How are you')
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should be successful for email with a lot other rules', () => {
		const validator = new NestjsGraphqlValidator({email: {regExp: REG_EXP_EMAIL}, a: {a: 1}, b: {b: 2}, c: {c: 3}})
		expect(validator.transform('thisis@email.com', {data: 'email'})).toEqual('thisis@email.com')
	})

	test('should be successful for email all fields', () => {
		const validator = new NestjsGraphqlValidator({
			email: {rules: ['isEmail']},
			name: {minLen: 10, maxLen: 20}
		})
		expect(validator.transform('thisis@email.com', {data: 'email'})).toEqual('thisis@email.com')
		expect(validator.transform('foooooooooo', {data: 'name'})).toEqual('foooooooooo')
	})
})

describe('orNull', () => {
	test('should accept orNull param', () => {
		const validator = new NestjsGraphqlValidator({number: {max: 20, orNull: true}})
		expect(validator.transform(null, {data: 'number'})).toEqual(null)
	})

	test('should fail when orNull is false', () => {
		const validator = new NestjsGraphqlValidator({number: {max: 20}}) // orNull is default false

		try {
			expect(validator.transform(null, {data: 'number'})).toEqual(null)
		} catch (e) {
			expect(e.message).toBe('Validation failed for property number, rules: max#number#20')
			expect(e instanceof BadRequestException).toBe(true)
		}
	})
})

describe('orNull', () => {
	test('should throw error for wrong enum', () => {
		const validator = new NestjsGraphqlValidator({text: {enum: ['foo']}})

		try {
			expect(validator.transform('wrong foo', {data: 'text'})).toEqual('foo')
		} catch (e) {
			expect(e.message).toBe(`Validation failed for property text, rules: enum#text#foo`)
			expect(e instanceof BadRequestException).toBe(true)
		}
	})

	test('should accept enum param', () => {
		const validator = new NestjsGraphqlValidator({text: {enum: ['foo']}})
		expect(validator.transform('foo', {data: 'text'})).toEqual('foo')
	})
})