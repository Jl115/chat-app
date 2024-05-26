const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models"); // Ensure correct import
const saltRounds = 10;
require("dotenv").config();
const secretKey = process.env.JWT_SECRET || "secret key"; // Make sure to set this in your .env file

/**
 * The function `createUserController` creates a new user, hashes the password, generates a JWT token, and returns the user
 * and token or an error message.
 * @param validationObj - The `validationObj` parameter in the `createUserController` function likely contains an object
 * with an `input` property that holds the user input data such as `username`, `email`, and `password`. The structure of
 * `validationObj` might look something like this:
 * @returns The `createUserController` function returns an object with either a status of "201" and a token if the user
 * creation is successful, or a status of "400" and an error message if there is an error creating the user.
 */
const createUserController = async (validationObj) => {
  const { username, email, password } = validationObj.input;
  try {
    const checkUser = await User.findOne({ where: { email } });
    if (checkUser) {
      return {
        status: "400",
        message: `User Already exists`,
      };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create the user
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      secretKey,
      {
        expiresIn: "20d",
      }
    );
    // Send back the user and the token
    return { status: "201", message: "created user", token };
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error creating user:", error);
    return {
      status: "400",
      message: `Invalid request: ${error.details[0].message}`,
    };
  }
};

module.exports = { createUserController };
