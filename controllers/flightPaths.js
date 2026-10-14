const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

const getAll = async (req, res) => {
  try {
    const flightPaths = await mongodb
      .getDb()
      .collection("flightPaths")
      .find()
      .toArray();

    return res.status(200).json(flightPaths);
  } catch (error) {
    console.error("Error retrieving flight paths:", error);
    return res.status(500).json({ error: "Failed to retrieve flight paths." });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid flight path ID." });
    }

    const flightPath = await mongodb
      .getDb()
      .collection("flightPaths")
      .findOne({ _id: new ObjectId(id) });

    if (!flightPath) {
      return res.status(404).json({ error: "Flight path not found." });
    }

    return res.status(200).json(flightPath);
  } catch (error) {
    console.error("Error retrieving flight path:", error);
    return res.status(500).json({ error: "Failed to retrieve flight path." });
  }
};

const validateFlightPath = (data) => {
  const {
    pathCode,
    airline,
    departureAirport,
    arrivalAirport,
    distance,
    estimatedDuration,
    isInternational,
    status,
  } = data;

  if (
    pathCode === undefined ||
    airline === undefined ||
    departureAirport === undefined ||
    arrivalAirport === undefined ||
    distance === undefined ||
    estimatedDuration === undefined ||
    isInternational === undefined ||
    status === undefined
  ) {
    return "Missing required flight path fields.";
  }

  if (
    typeof pathCode !== "string" ||
    typeof airline !== "string" ||
    typeof departureAirport !== "string" ||
    typeof arrivalAirport !== "string" ||
    typeof status !== "string" ||
    typeof isInternational !== "boolean"
  ) {
    return "Flight path text fields must be strings and isInternational must be a boolean.";
  }

  if (
    typeof distance !== "number" ||
    !Number.isFinite(distance) ||
    distance <= 0 ||
    typeof estimatedDuration !== "number" ||
    !Number.isFinite(estimatedDuration) ||
    estimatedDuration <= 0
  ) {
    return "Distance and estimatedDuration must be positive numbers.";
  }

  if (
    !pathCode.trim() ||
    !airline.trim() ||
    !departureAirport.trim() ||
    !arrivalAirport.trim() ||
    !status.trim()
  ) {
    return "Text fields cannot be blank.";
  }

  if (
    departureAirport.trim().toUpperCase() ===
    arrivalAirport.trim().toUpperCase()
  ) {
    return "Departure and arrival airports must be different.";
  }

  return null;
};

const formatFlightPath = (data) => ({
  pathCode: data.pathCode.trim().toUpperCase(),
  airline: data.airline.trim(),
  departureAirport: data.departureAirport.trim().toUpperCase(),
  arrivalAirport: data.arrivalAirport.trim().toUpperCase(),
  distance: data.distance,
  estimatedDuration: data.estimatedDuration,
  isInternational: data.isInternational,
  status: data.status.trim(),
});

const createFlightPath = async (req, res) => {
  try {
    const validationError = validateFlightPath(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newFlightPath = formatFlightPath(req.body);

    const result = await mongodb
      .getDb()
      .collection("flightPaths")
      .insertOne(newFlightPath);

    return res.status(201).json({
      message: "Flight path created successfully.",
      flightPathId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating flight path:", error);
    return res.status(500).json({ error: "Failed to create flight path." });
  }
};

const updateFlightPath = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid flight path ID." });
    }

    const validationError = validateFlightPath(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updatedFlightPath = formatFlightPath(req.body);

    const result = await mongodb
      .getDb()
      .collection("flightPaths")
      .replaceOne({ _id: new ObjectId(id) }, updatedFlightPath);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Flight path not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error updating flight path:", error);
    return res.status(500).json({ error: "Failed to update flight path." });
  }
};

const deleteFlightPath = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid flight path ID." });
    }

    const result = await mongodb
      .getDb()
      .collection("flightPaths")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Flight path not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting flight path:", error);
    return res.status(500).json({ error: "Failed to delete flight path." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createFlightPath,
  updateFlightPath,
  deleteFlightPath,
};
