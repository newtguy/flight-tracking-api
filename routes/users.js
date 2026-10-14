const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

router.get("/", (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get all users'
  // #swagger.description = 'Returns user profiles without GitHub IDs or email addresses.'
  usersController.getAll(req, res);
});

router.get("/:id", (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get a user by ID'
  // #swagger.description = 'Returns a single user profile by MongoDB ID.'
  usersController.getSingle(req, res);
});

router.post("/", (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Create a user'
  // #swagger.description = 'Direct user creation is disabled; users register through GitHub OAuth.'
  usersController.createUser(req, res);
});

router.put("/:id", (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Update a user'
  // #swagger.description = 'Direct user updates are disabled; profiles are managed through authentication.'
  usersController.updateUser(req, res);
});

router.delete("/:id", (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Delete a user'
  // #swagger.description = 'Deletes a user by MongoDB ID.'
  usersController.deleteUser(req, res);
});

module.exports = router;
