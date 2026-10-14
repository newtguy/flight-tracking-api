const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

const getAll = async (req, res) => {
  try {
    const users = await mongodb
      .getDb()
      .collection("users")
      .find(
        {},
        {
          projection: {
            githubId: 0,
            email: 0,
          },
        },
      )
      .toArray();

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ error: "Failed to retrieve users." });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const user = await mongodb
      .getDb()
      .collection("users")
      .findOne(
        { _id: new ObjectId(id) },
        {
          projection: {
            githubId: 0,
            email: 0,
          },
        },
      );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ error: "Failed to retrieve user." });
  }
};

// User records are created by the GitHub OAuth flow.
const createUser = async (req, res) => {
  return res.status(403).json({
    error: "Users must register through GitHub authentication.",
  });
};

// User profiles are managed by the GitHub OAuth flow.
const updateUser = async (req, res) => {
  return res.status(403).json({
    error: "User profiles cannot be updated through this endpoint.",
  });
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const result = await mongodb
      .getDb()
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Failed to delete user." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
