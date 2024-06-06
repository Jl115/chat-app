const axios = require("axios");

const createResponseController = async (requestObject) => {
  return new Promise(async (resolve, reject) => {
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
      resolve(response.data);
      return;
    } catch (error) {
      console.error("Error in createResponseController:", error);
      throw new Error("Failed to get response from API");
    }
  });
};

module.exports = { createResponseController };
