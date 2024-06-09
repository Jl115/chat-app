const Joi = require("joi");

/* The `const registrationSchema` is defining a schema using Joi for validating the input object during registration
validation. It specifies the structure and validation rules for the input object that should be provided when
registering a user. */
const registrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
/* The `const loginSchema` is defining a schema using Joi for validating the input object during login validation. */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

/* The `const updateSchema` is defining a schema using Joi for validating the input object during an update operation. It
specifies the structure and validation rules for the input object that should be provided when updating user
information. In this case, the schema requires the input object to have a `username` field that is an alphanumeric
string with a minimum length of 3 characters and a maximum length of 30 characters, and an `email` field that is a valid
email address. */
const updateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
/**
 * The function `registerValidator` validates input against a schema and returns a status message based on the validation
 * result.
 * @param input - The `registerValidator` function takes an `input` object as a parameter. This input object is validated
 * against a registration schema using `registrationSchema.validate(input)`. If the input object does not match the schema,
 * the function returns an object with a status of "400" and a message indicating the
 * @returns The `registerValidator` function returns an object with a `status`, `message`, and `input` property. If the
 * input object passes validation against the `registrationSchema`, it returns a status of "201" with a message "Input is
 * valid" and includes the input object. If there is a validation error, it returns a status of "400" with a message
 * indicating the specific validation error
 */
const registerValidator = (input) => {
  // Validate the input object against the schema
  const { error } = registrationSchema.validate(input);
  if (error) {
    return {
      status: "400",
      message: `Invalid request: ${error.details[0].message}`,
    };
  }

  return { status: "201", message: "Input is valid", input: input };
};
/**
 * The `loginValidator` function validates an input object against a schema and returns a status message based on the
 * validation result.
 * @param input - The `loginValidator` function takes an `input` object as a parameter and validates it against a
 * registration schema. If the input does not match the schema, it returns a response with a status code of 400 and a
 * message indicating the validation error. If the input is valid, it returns a
 * @returns The `loginValidator` function returns an object with a `status` property set to either "400" or "201" based on
 * the validation result, a `message` property providing information about the validation status, and the original `input`
 * object if it is valid.
 */
const loginValidator = (input) => {
  // Validate the input object against the schema
  const { error } = loginSchema.validate(input);
  if (error) {
    return {
      status: "400",
      message: `Invalid request: ${error.details[0].message}`,
    };
  }

  return { status: "201", message: "Input is valid", input: input };
};

const updateValidator = (input) => {
  // Validate the input object against the schema
  const { error } = updateSchema.validate(input);
  if (error) {
    return {
      status: "400",
      message: `Invalid request: ${error.details[0].message}`,
    };
  }

  return { status: "201", message: "Input is valid", input: input };
};

module.exports = { registerValidator, loginValidator, updateValidator };
