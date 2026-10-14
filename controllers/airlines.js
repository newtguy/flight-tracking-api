const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

const getAll = async (req, res) => {
  try {
    const airlines = await mongodb
      .getDb()
      .collection("airlines")
      .find()
      .toArray();

    return res.status(200).json(airlines);
  } catch (error) {
    console.error("Error retrieving airlines:", error);
    return res.status(500).json({ error: "Failed to retrieve airlines." });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid airline ID." });
    }

    const airline = await mongodb
      .getDb()
      .collection("airlines")
      .findOne({ _id: new ObjectId(id) });

    if (!airline) {
      return res.status(404).json({ error: "Airline not found." });
    }

    return res.status(200).json(airline);
  } catch (error) {
    console.error("Error retrieving airline:", error);
    return res.status(500).json({ error: "Failed to retrieve airline." });
  }
};

const createAirline = async (req, res) => {
  try {
    const {
      name,
      iataCode,
      icaoCode,
      country,
      founded,
      headquarters,
      website,
      fleetSize,
    } = req.body;

    if (
      !name ||
      !iataCode ||
      !icaoCode ||
      !country ||
      !headquarters ||
      !website ||
      founded === undefined ||
      fleetSize === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Missing required airline fields." });
    }

    if (
      typeof name !== "string" ||
      typeof iataCode !== "string" ||
      typeof icaoCode !== "string" ||
      typeof country !== "string" ||
      typeof headquarters !== "string" ||
      typeof website !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Airline text fields must be strings." });
    }

    if (
      !Number.isInteger(founded) ||
      founded < 1900 ||
      founded > new Date().getFullYear() ||
      !Number.isInteger(fleetSize) ||
      fleetSize < 0
    ) {
      return res.status(400).json({
        error:
          "Founded must be a valid year and fleetSize must be a non-negative integer.",
      });
    }

    if (!/^[A-Za-z0-9]{2}$/.test(iataCode) || !/^[A-Za-z]{3}$/.test(icaoCode)) {
      return res.status(400).json({
        error:
          "IATA codes must be 2 alphanumeric characters and ICAO codes 3 letters.",
      });
    }

    const newAirline = {
      name: name.trim(),
      iataCode: iataCode.trim().toUpperCase(),
      icaoCode: icaoCode.trim().toUpperCase(),
      country: country.trim(),
      founded,
      headquarters: headquarters.trim(),
      website: website.trim(),
      fleetSize,
    };

    if (
      !newAirline.name ||
      !newAirline.country ||
      !newAirline.headquarters ||
      !newAirline.website
    ) {
      return res.status(400).json({ error: "Text fields cannot be blank." });
    }

    const result = await mongodb
      .getDb()
      .collection("airlines")
      .insertOne(newAirline);

    return res.status(201).json({
      message: "Airline created successfully.",
      airlineId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating airline:", error);
    return res.status(500).json({ error: "Failed to create airline." });
  }
};

const updateAirline = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid airline ID." });
    }

    const {
      name,
      iataCode,
      icaoCode,
      country,
      founded,
      headquarters,
      website,
      fleetSize,
    } = req.body;

    if (
      !name ||
      !iataCode ||
      !icaoCode ||
      !country ||
      !headquarters ||
      !website ||
      founded === undefined ||
      fleetSize === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Missing required airline fields." });
    }

    if (
      typeof name !== "string" ||
      typeof iataCode !== "string" ||
      typeof icaoCode !== "string" ||
      typeof country !== "string" ||
      typeof headquarters !== "string" ||
      typeof website !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Airline text fields must be strings." });
    }

    if (
      !Number.isInteger(founded) ||
      founded < 1900 ||
      founded > new Date().getFullYear() ||
      !Number.isInteger(fleetSize) ||
      fleetSize < 0
    ) {
      return res.status(400).json({
        error:
          "Founded must be a valid year and fleetSize must be a non-negative integer.",
      });
    }

    if (!/^[A-Za-z0-9]{2}$/.test(iataCode) || !/^[A-Za-z]{3}$/.test(icaoCode)) {
      return res.status(400).json({
        error:
          "IATA codes must be 2 alphanumeric characters and ICAO codes 3 letters.",
      });
    }

    const updatedAirline = {
      name: name.trim(),
      iataCode: iataCode.trim().toUpperCase(),
      icaoCode: icaoCode.trim().toUpperCase(),
      country: country.trim(),
      founded,
      headquarters: headquarters.trim(),
      website: website.trim(),
      fleetSize,
    };

    if (
      !updatedAirline.name ||
      !updatedAirline.country ||
      !updatedAirline.headquarters ||
      !updatedAirline.website
    ) {
      return res.status(400).json({ error: "Text fields cannot be blank." });
    }

    const result = await mongodb
      .getDb()
      .collection("airlines")
      .replaceOne({ _id: new ObjectId(id) }, updatedAirline);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Airline not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error updating airline:", error);
    return res.status(500).json({ error: "Failed to update airline." });
  }
};

const deleteAirline = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid airline ID." });
    }

    const result = await mongodb
      .getDb()
      .collection("airlines")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Airline not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting airline:", error);
    return res.status(500).json({ error: "Failed to delete airline." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createAirline,
  updateAirline,
  deleteAirline,
};
