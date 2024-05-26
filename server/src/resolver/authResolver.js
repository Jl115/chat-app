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
 * @param input - The `registerResolver` function takes an `input` object as a parameter. This object is validated against a
 * registration schema using the `registrationSchema.validate(input)` method. If the input object does not match the
 * schema, the function returns an error response with a status code of "400" and a
 * @returns The `registerResolver` function is returning an object with a `status`, `message`, and `input` properties. If the
 * input object passes validation against the schema, it will return `{ status: "201", message: "Input is valid", input }`.
 * If there is an error in validation, it will return `{ status: "400", message: "Invalid request: ${error.details[
 */
const registerResolver = (input) => {
  console.log("\x1b[33m%s\x1b[0m", "input --------------------", input);
  // Validate the input object against the schema
  const { error } = registrationSchema.validate(input);
  console.log("\x1b[33m%s\x1b[0m", "1 --------------------", 1);
  if (error) {
    console.log("\x1b[33m%s\x1b[0m", "2 --------------------", 1);
    return {
      status: "400",
      message: `Invalid request: ${error.details[0].message}`,
    };
  }

  console.log("\x1b[33m%s\x1b[0m", "3 --------------------", 1);
  return { status: "201", message: "Input is valid", input };
};

module.exports = { registerResolver };
