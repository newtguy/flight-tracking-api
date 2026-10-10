const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Flight Tracking API",
    description:
      "API for managing fictional flight tracking data and airport information.",
    version: "1.0.0",
  },
  host: "https://flight-tracking-api.onrender.com",
  schemes: ["https"],
  tags: [
    {
      name: "Flights",
      description: "Endpoints for managing fictional flight data.",
    },
    {
      name: "Airports",
      description: "Endpoints for managing airport information.",
    },
  ],
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
