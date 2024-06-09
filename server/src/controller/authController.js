const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const saltRounds = 10;
require("dotenv").config();
const secretKey = process.env.JWT_SECRET || "secret key";

const checkUserIfExists = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    return null;
  }
};

const createUserController = async (object) => {
  const { username, email, password } = object.input;
  try {
    const checkUser = await checkUserIfExists(email);
    if (checkUser) {
      return {
        status: "400",
        message: "User already exists",
      };
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      secretKey,
      { expiresIn: "20d" }
    );
    return { status: "201", message: "User created", token };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: "400",
      message: `Invalid request: ${error.message}`,
    };
  }
};

const checkUserController = async (object) => {
  const { email, password } = object.input;
  try {
    const user = await checkUserIfExists(email);
    if (!user) {
      return {
        status: "400",
        message: "Invalid email or password",
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: "400",
        message: "Invalid email or password",
      };
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      secretKey,
      { expiresIn: "20d" }
    );
    return { status: "200", message: "Logged in successfully", token };
  } catch (error) {
    console.error("Error checking user:", error);
    return {
      status: "400",
      message: `Invalid request: ${error.message}`,
    };
  }
};

const updateUserController = async (object, token) => {
  const { username, email, password } = object.input;
  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded) {
      const user = await User.findOne({
        where: { email: decoded.email },
      });
      if (!user) {
        return {
          status: "400",
          message: "User not found",
        };
      }
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
      }
      await user.save();
      return {
        status: "200",
        message: "User updated successfully",
      };
    }
  } catch (error) {
    return {
      status: "400",
      message: "Invalid token",
    };
  }
};

module.exports = {
  createUserController,
  checkUserController,
  updateUserController,
};
