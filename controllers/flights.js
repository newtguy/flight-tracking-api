const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

const getAll = async (req, res) => {
  try {
    const flights = await mongodb
      .getDb()
      .collection("flights")
      .find()
      .toArray();

    res.status(200).json(flights);
  } catch (error) {
    console.error("Error retrieving flights:", error);
    res.status(500).json({ error: "Failed to retrieve flights." });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid flight ID." });
    }

    const flight = await mongodb
      .getDb()
      .collection("flights")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!flight) {
      return res.status(404).json({ error: "Flight not found." });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.error("Error retrieving flight:", error);
    res.status(500).json({ error: "Failed to retrieve flight." });
  }
};

const createFlight = async (req, res) => {
  try {
    const {
      flightNumber,
      airline,
      aircraftType,
      departureAirport,
      arrivalAirport,
      status,
      altitude,
      speed,
      latitude,
      longitude,
    } = req.body;

    if (
      !flightNumber ||
      !airline ||
      !aircraftType ||
      !departureAirport ||
      !arrivalAirport ||
      !status
    ) {
      return res.status(400).json({
        error: "Missing required flight fields.",
      });
    }

    if (
      typeof flightNumber !== "string" ||
      typeof airline !== "string" ||
      typeof aircraftType !== "string" ||
      typeof departureAirport !== "string" ||
      typeof arrivalAirport !== "string" ||
      typeof status !== "string"
    ) {
      return res.status(400).json({
        error: "Flight text fields must be strings.",
      });
    }

    if (
      !Number.isFinite(altitude) ||
      !Number.isFinite(speed) ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return res.status(400).json({
        error: "Altitude, speed, latitude, and longitude must be numbers.",
      });
    }

    if (
      altitude < 0 ||
      speed < 0 ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        error: "Flight position or movement values are out of range.",
      });
    }

    if (departureAirport === arrivalAirport) {
      return res.status(400).json({
        error: "Departure and arrival airports must be different.",
      });
    }

    const newFlight = {
      flightNumber: flightNumber.trim(),
      airline: airline.trim(),
      aircraftType: aircraftType.trim(),
      departureAirport: departureAirport.trim().toUpperCase(),
      arrivalAirport: arrivalAirport.trim().toUpperCase(),
      status: status.trim(),
      altitude,
      speed,
      latitude,
      longitude,
    };

    if (
      !newFlight.flightNumber ||
      !newFlight.airline ||
      !newFlight.aircraftType ||
      !newFlight.departureAirport ||
      !newFlight.arrivalAirport ||
      !newFlight.status
    ) {
      return res.status(400).json({
        error: "Text fields cannot contain only whitespace.",
      });
    }

    const result = await require("../db/connect")
      .getDb()
      .collection("flights")
      .insertOne(newFlight);

    res.status(201).json({
      message: "Flight created successfully.",
      flightId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ error: "Failed to create flight." });
  }
};

const updateFlight = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid flight ID." });
    }

    const {
      flightNumber,
      airline,
      aircraftType,
      departureAirport,
      arrivalAirport,
      status,
      altitude,
      speed,
      latitude,
      longitude,
    } = req.body;

    if (
      !flightNumber ||
      !airline ||
      !aircraftType ||
      !departureAirport ||
      !arrivalAirport ||
      !status
    ) {
      return res.status(400).json({
        error: "Missing required flight fields.",
      });
    }

    if (
      typeof flightNumber !== "string" ||
      typeof airline !== "string" ||
      typeof aircraftType !== "string" ||
      typeof departureAirport !== "string" ||
      typeof arrivalAirport !== "string" ||
      typeof status !== "string"
    ) {
      return res.status(400).json({
        error: "Flight text fields must be strings.",
      });
    }

    if (
      !Number.isFinite(altitude) ||
      !Number.isFinite(speed) ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return res.status(400).json({
        error: "Altitude, speed, latitude, and longitude must be numbers.",
      });
    }

    if (
      altitude < 0 ||
      speed < 0 ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        error: "Flight position or movement values are out of range.",
      });
    }

    const updatedFlight = {
      flightNumber: flightNumber.trim(),
      airline: airline.trim(),
      aircraftType: aircraftType.trim(),
      departureAirport: departureAirport.trim().toUpperCase(),
      arrivalAirport: arrivalAirport.trim().toUpperCase(),
      status: status.trim(),
      altitude,
      speed,
      latitude,
      longitude,
    };

    if (
      !updatedFlight.flightNumber ||
      !updatedFlight.airline ||
      !updatedFlight.aircraftType ||
      !updatedFlight.departureAirport ||
      !updatedFlight.arrivalAirport ||
      !updatedFlight.status
    ) {
      return res.status(400).json({
        error: "Text fields cannot contain only whitespace.",
      });
    }

    if (updatedFlight.departureAirport === updatedFlight.arrivalAirport) {
      return res.status(400).json({
        error: "Departure and arrival airports must be different.",
      });
    }

    const result = await mongodb
      .getDb()
      .collection("flights")
      .replaceOne({ _id: new ObjectId(id) }, updatedFlight);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Flight not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error updating flight:", error);
    return res.status(500).json({ error: "Failed to update flight." });
  }
};

const deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid flight ID." });
    }

    const result = await mongodb
      .getDb()
      .collection("flights")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Flight not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting flight:", error);
    return res.status(500).json({ error: "Failed to delete flight." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createFlight,
  updateFlight,
  deleteFlight,
};
