const express = require("express");
const router = express.Router();
const flightsController = require("../controllers/flights");

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

router.post("/", (req, res) => {
  // #swagger.tags = ['Flights']
  // #swagger.summary = 'Create a flight'
  // #swagger.description = 'Creates a new flight using the provided flight data.'
  flightsController.createFlight(req, res);
});

router.put("/:id", (req, res) => {
  // #swagger.tags = ['Flights']
  // #swagger.summary = 'Update a flight'
  // #swagger.description = 'Replaces an existing flight with the provided flight data.'
  flightsController.updateFlight(req, res);
});

router.delete("/:id", (req, res) => {
  // #swagger.tags = ['Flights']
  // #swagger.summary = 'Delete a flight'
  // #swagger.description = 'Deletes a flight matching the provided MongoDB ID.'
  flightsController.deleteFlight(req, res);
});

module.exports = router;
