const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongodb = require("./db/connect");
const flightsRoutes = require("./routes/flights");
const airportsRoutes = require("./routes/airports");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/flights", flightsRoutes);
app.use("/airports", airportsRoutes);

// Temporary route to verify the server is running
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Flight Tracking API.",
  });
});

mongodb.initDb((err) => {
  if (err) {
    console.error("Failed to initialize database. Server not started.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
