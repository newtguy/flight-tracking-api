const express = require("express");
const router = express.Router();
const airportsController = require("../controllers/airports");
const isAuthenticated = require("../middleware/auth");

router.get("/", (req, res) => {
  // #swagger.tags = ['Airports']
  // #swagger.summary = 'Get all airports'
  // #swagger.description = 'Returns a list of all airports in the collection.'
  airportsController.getAll(req, res);
});

router.get("/:id", (req, res) => {
  // #swagger.tags = ['Airports']
  // #swagger.summary = 'Get an airport by ID'
  // #swagger.description = 'Returns a single airport matching the provided MongoDB ID.'
  airportsController.getSingle(req, res);
});

router.post("/", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Airports']
  // #swagger.summary = 'Create an airport'
  // #swagger.description = 'Creates a new airport. Requires GitHub authentication.'
  airportsController.createAirport(req, res);
});

router.put("/:id", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Airports']
  // #swagger.summary = 'Update an airport'
  // #swagger.description = 'Replaces an existing airport with the provided airport data. Requires GitHub authentication.'
  airportsController.updateAirport(req, res);
});

router.delete("/:id", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Airports']
  // #swagger.summary = 'Delete an airport'
  // #swagger.description = 'Deletes an airport matching the provided MongoDB ID. Requires GitHub authentication.'
  airportsController.deleteAirport(req, res);
});

module.exports = router;
