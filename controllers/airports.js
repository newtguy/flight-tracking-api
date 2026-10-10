const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

const getAll = async (req, res) => {
  try {
    const airports = await mongodb
      .getDb()
      .collection("airports")
      .find()
      .toArray();

    res.status(200).json(airports);
  } catch (error) {
    console.error("Error retrieving airports:", error);
    res.status(500).json({ error: "Failed to retrieve airports." });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid airport ID." });
    }

    const airport = await mongodb
      .getDb()
      .collection("airports")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!airport) {
      return res.status(404).json({ error: "Airport not found." });
    }

    res.status(200).json(airport);
  } catch (error) {
    console.error("Error retrieving airport:", error);
    res.status(500).json({ error: "Failed to retrieve airport." });
  }
};

const createAirport = async (req, res) => {
  try {
    const {
      name,
      iataCode,
      icaoCode,
      city,
      country,
      latitude,
      longitude,
      elevation,
    } = req.body;

    if (!name || !iataCode || !icaoCode || !city || !country) {
      return res.status(400).json({
        error: "Missing required airport fields.",
      });
    }

    if (
      typeof name !== "string" ||
      typeof iataCode !== "string" ||
      typeof icaoCode !== "string" ||
      typeof city !== "string" ||
      typeof country !== "string"
    ) {
      return res.status(400).json({
        error: "Airport text fields must be strings.",
      });
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(elevation)
    ) {
      return res.status(400).json({
        error: "Latitude, longitude, and elevation must be numbers.",
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        error: "Airport coordinates are out of range.",
      });
    }

    if (!/^[A-Za-z]{3}$/.test(iataCode) || !/^[A-Za-z]{4}$/.test(icaoCode)) {
      return res.status(400).json({
        error: "IATA codes must have 3 letters and ICAO codes 4 letters.",
      });
    }

    const newAirport = {
      name: name.trim(),
      iataCode: iataCode.trim().toUpperCase(),
      icaoCode: icaoCode.trim().toUpperCase(),
      city: city.trim(),
      country: country.trim(),
      latitude,
      longitude,
      elevation,
    };

    if (!newAirport.name || !newAirport.city || !newAirport.country) {
      return res.status(400).json({
        error: "Text fields cannot contain only whitespace.",
      });
    }

    const result = await require("../db/connect")
      .getDb()
      .collection("airports")
      .insertOne(newAirport);

    res.status(201).json({
      message: "Airport created successfully.",
      airportId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating airport:", error);
    res.status(500).json({ error: "Failed to create airport." });
  }
};

const updateAirport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid airport ID." });
    }

    const {
      name,
      iataCode,
      icaoCode,
      city,
      country,
      latitude,
      longitude,
      elevation,
    } = req.body;

    if (!name || !iataCode || !icaoCode || !city || !country) {
      return res.status(400).json({
        error: "Missing required airport fields.",
      });
    }

    if (
      typeof name !== "string" ||
      typeof iataCode !== "string" ||
      typeof icaoCode !== "string" ||
      typeof city !== "string" ||
      typeof country !== "string"
    ) {
      return res.status(400).json({
        error: "Airport text fields must be strings.",
      });
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(elevation)
    ) {
      return res.status(400).json({
        error: "Latitude, longitude, and elevation must be numbers.",
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        error: "Airport coordinates are out of range.",
      });
    }

    if (!/^[A-Za-z]{3}$/.test(iataCode) || !/^[A-Za-z]{4}$/.test(icaoCode)) {
      return res.status(400).json({
        error: "IATA codes must have 3 letters and ICAO codes 4 letters.",
      });
    }

    const updatedAirport = {
      name: name.trim(),
      iataCode: iataCode.trim().toUpperCase(),
      icaoCode: icaoCode.trim().toUpperCase(),
      city: city.trim(),
      country: country.trim(),
      latitude,
      longitude,
      elevation,
    };

    if (
      !updatedAirport.name ||
      !updatedAirport.city ||
      !updatedAirport.country
    ) {
      return res.status(400).json({
        error: "Text fields cannot contain only whitespace.",
      });
    }

    const result = await mongodb
      .getDb()
      .collection("airports")
      .replaceOne({ _id: new ObjectId(id) }, updatedAirport);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Airport not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error updating airport:", error);
    return res.status(500).json({ error: "Failed to update airport." });
  }
};

const deleteAirport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid airport ID." });
    }

    const result = await mongodb
      .getDb()
      .collection("airports")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Airport not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting airport:", error);
    return res.status(500).json({ error: "Failed to delete airport." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createAirport,
  updateAirport,
  deleteAirport,
};
