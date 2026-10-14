const express = require("express");
const router = express.Router();
const airlinesController = require("../controllers/airlines");
const isAuthenticated = require("../middleware/auth");

router.get("/", (req, res) => {
  // #swagger.tags = ['Airlines']
  // #swagger.summary = 'Get all airlines'
  // #swagger.description = 'Returns all airlines in the collection.'
  airlinesController.getAll(req, res);
});

router.get("/:id", (req, res) => {
  // #swagger.tags = ['Airlines']
  // #swagger.summary = 'Get an airline by ID'
  // #swagger.description = 'Returns one airline matching the MongoDB ID.'
  airlinesController.getSingle(req, res);
});

router.post("/", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Airlines']
  // #swagger.summary = 'Create an airline'
  // #swagger.description = 'Creates an airline using the supplied data. Requires GitHub authentication.'
  airlinesController.createAirline(req, res);
});

router.put("/:id", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Airlines']
  // #swagger.summary = 'Update an airline'
  // #swagger.description = 'Replaces an existing airline with the supplied data. Requires GitHub authentication.'
  airlinesController.updateAirline(req, res);
});

router.delete("/:id", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Airlines']
  // #swagger.summary = 'Delete an airline'
  // #swagger.description = 'Deletes an airline by MongoDB ID. Requires GitHub authentication.'
  airlinesController.deleteAirline(req, res);
});

module.exports = router;
