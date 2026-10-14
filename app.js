const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;
require("dotenv").config();

const mongodb = require("./db/connect");
const passport = require("./config/passport");

const flightsRoutes = require("./routes/flights");
const airportsRoutes = require("./routes/airports");
const airlinesRoutes = require("./routes/airlines");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const flightPathsRoutes = require("./routes/flightPaths");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const app = express();
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/flights", flightsRoutes);
app.use("/airports", airportsRoutes);
app.use("/airlines", airlinesRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/flight-paths", flightPathsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Flight Tracking API.",
  });
});

if (require.main === module) {
  mongodb.initDb((err) => {
    if (err) {
      console.error("Failed to initialize database. Server not started.");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

module.exports = app;
