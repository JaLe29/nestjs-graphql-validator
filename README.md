# nestjs graphql validator [![NPM version](https://badge.fury.io/js/nestjs-graphql-validator.svg)](http://badge.fury.io/js/nestjs-graphql-validator)

Would you like to validate that your string is not longer than 250 characters? Or is acceptable by regex? You can...

### Example usage
In your `resolver` file
```javascript
import NestjsGraphqlValidator from 'nestjs-graphql-validator'

@Mutation()
@UsePipes(new NestjsGraphqlValidator({
	email: { maxLen: 255, minLen: 10, rules: ['isEmail'] },
}))
public exampleA(
	@Args('email') email: string,
	@Args('name') name: string,
) {
	// ...
	return { email, name }
}

@Mutation()
@UsePipes(new NestjsGraphqlValidator({
	email: { regExp: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ },
}))
public exampleB(
	@Args('email') email: string,
) {
	    // ...
}

@Query()
@UsePipes(new NestjsGraphqlValidator({
	number: { max: 20 },
}))
public exampleC(
	@Args('email') email: string,
) {
	    // ...
}

@Query()
@UsePipes(new NestjsGraphqlValidator({
	data_email: { maxLen: 255, minLen: 10, rules: ['isEmail'] }, // nested ----> email is in object (data.email)
}))
public exampleD(
	@Args('data') data: { email: string, name: string },
) {
	    // ...
}
```
Email field is validated before body of `createUserTest` is execuded.

In case of error `BadRequestException` from `import { BadRequestException } from '@nestjs/common'`the is throwed.

### Supported operations
| Name   | Type               |
|--------|--------------------|
| maxLen | string             |
| minLen | string             |
| min    | number             |
| max    | number             |
| regExp | regular expression |
| rules  | Array of strings   |

(for rules only isEmail is avalible right now)
