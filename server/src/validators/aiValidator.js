const Joi = require("joi");

// Joi Schema validation
const aiValidatorSchema = Joi.object({
  message: Joi.string().required(),
  token: Joi.string().required(),
});

/**
 * The `aiMessageValidator` function validates input objects against a schema and returns a status message based on the
 * validation result.
 * @param input - The input object that contains a message and a token to be validated.
 * @returns The aiMessageValidator function returns an object with a status code and a message. If the input object does
 * not pass validation against the schema, it returns a status code of "400" along with a message indicating the validation
 * error. If the input is valid, it returns a status code of "201" and a message stating that the input is valid, along
 * with the input object itself.
 */
const aiMessageValidator = (input) => {
  // Validate the input object against the schema
  const validation = aiValidatorSchema.validate(input, { abortEarly: false });

  if (error) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "Validation Error --------------------",
      error.details
    );
    return {
      status: "400",
      message: `Invalid request: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`,
    };
  }

  return { status: "201", message: "Input is valid", input: input };
};

module.exports = { aiMessageValidator };
