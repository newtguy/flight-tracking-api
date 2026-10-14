const express = require("express");
const router = express.Router();

const flightPathsController = require("../controllers/flightPaths");
const isAuthenticated = require("../middleware/auth");

// GET all flight paths
router.get("/", (req, res) => {
  // #swagger.tags = ['Flight Paths']
  // #swagger.summary = 'Get all flight paths'
  // #swagger.description = 'Returns all flight paths in the collection.'
  flightPathsController.getAll(req, res);
});

// GET a flight path by ID
router.get("/:id", (req, res) => {
  // #swagger.tags = ['Flight Paths']
  // #swagger.summary = 'Get a flight path by ID'
  // #swagger.description = 'Returns a single flight path matching the provided MongoDB ID.'
  flightPathsController.getSingle(req, res);
});

// POST a new flight path
router.post("/", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Flight Paths']
  // #swagger.summary = 'Create a flight path'
  // #swagger.description = 'Creates a new flight path. Requires GitHub authentication.'
  flightPathsController.createFlightPath(req, res);
});

// PUT an existing flight path
router.put("/:id", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Flight Paths']
  // #swagger.summary = 'Update a flight path'
  // #swagger.description = 'Replaces an existing flight path. Requires GitHub authentication.'
  flightPathsController.updateFlightPath(req, res);
});

// DELETE a flight path
router.delete("/:id", isAuthenticated, (req, res) => {
  // #swagger.tags = ['Flight Paths']
  // #swagger.summary = 'Delete a flight path'
  // #swagger.description = 'Deletes a flight path by MongoDB ID. Requires GitHub authentication.'
  flightPathsController.deleteFlightPath(req, res);
});

module.exports = router;
