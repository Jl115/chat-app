const { aiMessageValidator } = require("../validators/aiValidator");
const { createResponseController } = require("../controller/aiController");
require("dotenv").config();

/**
 * The `aiRoutes` function defines routes for handling basic CRUD operations related to AI chat functionality.
 * @param router - The `router` parameter in the `aiRoutes` function is an instance of Express Router. It is used to define
 * different routes for handling HTTP requests in an Express application. In the provided code snippet, the `router` object
 * is used to define three routes: a GET route for the root path
 */
const aiRoutes = (router) => {
  router.get("/ai", (req, res) => {
    res.send("chat ai");
  });

  router.post("/ask", async (req, res) => {
    const validationObject = aiMessageValidator(req.body);
    if (validationObject.status === "400") {
      return res.send(validationObject);
    }
    const response = await createResponseController(validationObject.input);
    if (response.status === "400") {
      return res.send(response);
    }
    return res.send(response);
  });

  router.post("/create", (req, res) => {
    res.send("create ai chat"); // redirect to /profile if authenticated
  });

  router.delete("/delete", (req, res) => {
    res.send("delete ai chat");
  });
  return router;
};

module.exports = aiRoutes;
