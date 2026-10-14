const express = require("express");
const router = express.Router();
const flightsController = require("../controllers/flights");
const isAuthenticated = require("../middleware/auth");

router.get("/", (req, res) => {
  // #swagger.tags = ['Flights']
  // #swagger.summary = 'Get all flights'
  // #swagger.description = 'Returns a list of all flights in the collection.'
  flightsController.getAll(req, res);
});

router.get("/:id", (req, res) => {
  // #swagger.tags = ['Flights']
  // #swagger.summary = 'Get a flight by ID'
  // #swagger.description = 'Returns a single flight matching the provided MongoDB ID.'
  flightsController.getSingle(req, res);
});

router.post("/", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Flights']
  // #swagger.summary = 'Create a flight'
  // #swagger.description = 'Creates a new flight. Requires GitHub authentication.'
  flightsController.createFlight(req, res);
});

router.put("/:id", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Flights']
  // #swagger.summary = 'Update a flight'
  // #swagger.description = 'Updates an existing flight. Requires GitHub authentication.'
  flightsController.updateFlight(req, res);
});

router.delete("/:id", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Flights']
  // #swagger.summary = 'Delete a flight'
  // #swagger.description = 'Deletes a flight matching the provided MongoDB ID. Requires GitHub authentication.'
  flightsController.deleteFlight(req, res);
});

module.exports = router;
