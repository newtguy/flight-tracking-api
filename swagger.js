const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Flight Tracking API",
    description:
      "A RESTful API for managing fictional flight tracking data, airports, airlines, and flight paths. Supports GitHub OAuth authentication, public read operations, and authenticated create, update, and delete operations.",
    version: "1.0.0",
  },
  host: "flight-tracking-api.onrender.com",
  schemes: ["https"],
  tags: [
    {
      name: "Flights",
      description: "Endpoints for managing fictional flight tracking records.",
    },
    {
      name: "Airports",
      description: "Endpoints for managing airport information.",
    },
    {
      name: "Airlines",
      description: "Endpoints for managing airline information.",
    },
    {
      name: "Flight Paths",
      description:
        "Endpoints for managing flight routes, distances, and estimated durations.",
    },
    {
      name: "Authentication",
      description:
        "Endpoints for GitHub OAuth login, authentication status, and logout.",
    },
    {
      name: "Users",
      description:
        "Endpoints for retrieving user records associated with GitHub authentication.",
    },
  ],
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
