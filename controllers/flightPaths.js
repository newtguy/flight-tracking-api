const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

const getAll = async (req, res) => {
  try {
    const flightPaths = await mongodb
      .getDb()
      .collection("flightPaths")
      .find()
      .toArray();

    res.status(200).json(flightPaths);
  } catch (error) {
    console.error("Error retrieving flight paths:", error);
    res.status(500).json({ error: "Failed to retrieve flight paths." });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid flight path ID." });
    }

    const flightPath = await mongodb
      .getDb()
      .collection("flightPaths")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!flightPath) {
      return res.status(404).json({ error: "Flight path not found." });
    }

    res.status(200).json(flightPath);
  } catch (error) {
    console.error("Error retrieving flight path:", error);
    res.status(500).json({ error: "Failed to retrieve flight path." });
  }
};

const createFlightPath = async (req, res) => {
  try {
    const {
      pathCode,
      airline,
      departureAirport,
      arrivalAirport,
      distance,
      estimatedDuration,
      isInternational,
      status,
    } = req.body;

    if (
      !pathCode ||
      !airline ||
      !departureAirport ||
      !arrivalAirport ||
      distance === undefined ||
      estimatedDuration === undefined ||
      isInternational === undefined ||
      !status
    ) {
      return res.status(400).json({
        error: "Missing required flight path fields.",
      });
    }

    if (
      typeof pathCode !== "string" ||
      typeof airline !== "string" ||
      typeof departureAirport !== "string" ||
      typeof arrivalAirport !== "string" ||
      typeof status !== "string" ||
      typeof isInternational !== "boolean"
    ) {
      return res.status(400).json({
        error:
          "Flight path text fields must be strings and isInternational must be a boolean.",
      });
    }

    if (
      typeof distance !== "number" ||
      !Number.isFinite(distance) ||
      distance <= 0 ||
      typeof estimatedDuration !== "number" ||
      !Number.isFinite(estimatedDuration) ||
      estimatedDuration <= 0
    ) {
      return res.status(400).json({
        error: "Distance and estimatedDuration must be positive numbers.",
      });
    }

    if (
      !pathCode.trim() ||
      !airline.trim() ||
      !departureAirport.trim() ||
      !arrivalAirport.trim() ||
      !status.trim()
    ) {
      return res.status(400).json({
        error: "Text fields cannot contain only whitespace.",
      });
    }

    if (
      departureAirport.trim().toUpperCase() ===
      arrivalAirport.trim().toUpperCase()
    ) {
      return res.status(400).json({
        error: "Departure and arrival airports must be different.",
      });
    }

    const newFlightPath = {
      pathCode: pathCode.trim().toUpperCase(),
      airline: airline.trim(),
      departureAirport: departureAirport.trim().toUpperCase(),
      arrivalAirport: arrivalAirport.trim().toUpperCase(),
      distance,
      estimatedDuration,
      isInternational,
      status: status.trim(),
    };

    const result = await mongodb
      .getDb()
      .collection("flightPaths")
      .insertOne(newFlightPath);

    res.status(201).json({
      message: "Flight path created successfully.",
      flightPathId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating flight path:", error);
    res.status(500).json({ error: "Failed to create flight path." });
  }
};

const updateFlightPath = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid flight path ID." });
    }

    const {
      pathCode,
      airline,
      departureAirport,
      arrivalAirport,
      distance,
      estimatedDuration,
      isInternational,
      status,
    } = req.body;

    if (
      !pathCode ||
      !airline ||
      !departureAirport ||
      !arrivalAirport ||
      distance === undefined ||
      estimatedDuration === undefined ||
      isInternational === undefined ||
      !status
    ) {
      return res.status(400).json({
        error: "Missing required flight path fields.",
      });
    }

    if (
      typeof pathCode !== "string" ||
      typeof airline !== "string" ||
      typeof departureAirport !== "string" ||
      typeof arrivalAirport !== "string" ||
      typeof status !== "string" ||
      typeof isInternational !== "boolean"
    ) {
      return res.status(400).json({
        error:
          "Flight path text fields must be strings and isInternational must be a boolean.",
      });
    }

    if (
      typeof distance !== "number" ||
      !Number.isFinite(distance) ||
      distance <= 0 ||
      typeof estimatedDuration !== "number" ||
      !Number.isFinite(estimatedDuration) ||
      estimatedDuration <= 0
    ) {
      return res.status(400).json({
        error: "Distance and estimatedDuration must be positive numbers.",
      });
    }

    if (
      !pathCode.trim() ||
      !airline.trim() ||
      !departureAirport.trim() ||
      !arrivalAirport.trim() ||
      !status.trim()
    ) {
      return res.status(400).json({
        error: "Text fields cannot be only whitespace.",
      });
    }

    if (
      departureAirport.trim().toUpperCase() ===
      arrivalAirport.trim().toUpperCase()
    ) {
      return res.status(400).json({
        error: "Departure and arrival airports must be different.",
      });
    }

    const updatedFlightPath = {
      pathCode: pathCode.trim().toUpperCase(),
      airline: airline.trim(),
      departureAirport: departureAirport.trim().toUpperCase(),
      arrivalAirport: arrivalAirport.trim().toUpperCase(),
      distance,
      estimatedDuration,
      isInternational,
      status: status.trim(),
    };

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
    res.status(500).json({ error: "Failed to update flight path." });
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
    res.status(500).json({ error: "Failed to delete flight path." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createFlightPath,
  updateFlightPath,
  deleteFlightPath,
};
