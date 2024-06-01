const Joi = require("joi");

// Joi Schema validation
const registrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

/**
 * The function `registerResolver` validates input against a schema and returns a status message based on the validation
 * result.
 * @param input - The `registerResolver` function takes an `input` object as a parameter. This input object is validated
 * against a registration schema using `registrationSchema.validate(input)`. If the input object does not match the schema,
 * the function returns an object with a status of "400" and a message indicating the
 * @returns The `registerResolver` function returns an object with a `status`, `message`, and `input` property. If the
 * input object passes validation against the `registrationSchema`, it returns a status of "201" with a message "Input is
 * valid" and includes the input object. If there is a validation error, it returns a status of "400" with a message
 * indicating the specific validation error
 */
const registerResolver = (input) => {
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

module.exports = { registerResolver };