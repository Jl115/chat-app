const axios = require("axios");

const createResponseController = async (requestObject) => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "requestObject --------------------",
    requestObject
  );
  try {
    const response = await axios.post(
      process.env.API_URL || "http://localhost:9095/api/chat",
      {
        model: process.env.MODEL_NAME || "gemma:2b",
        messages: [
          {
            role: "user",
            content: requestObject.message,
          },
        ],
        stream: false,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in createResponseController:", error);
    throw new Error("Failed to get response from API");
  }
};

module.exports = { createResponseController };
