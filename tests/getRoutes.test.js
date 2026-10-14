process.env.SESSION_SECRET = "test-session-secret";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/flight-tracking-test";

jest.mock("../db/connect", () => ({
  getDb: jest.fn(),
}));

jest.mock("connect-mongo", () => ({
  MongoStore: {
    create: () => new (require("express-session").MemoryStore)(),
  },
}));

jest.mock("../config/passport", () => ({
  initialize: () => (req, res, next) => next(),
  session: () => (req, res, next) => next(),
  authenticate: () => (req, res, next) => next(),
}));

const request = require("supertest");
const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");
const app = require("../app");

const validId = "507f1f77bcf86cd799439011";

const resources = [
  { name: "flights", path: "/flights/" },
  { name: "airports", path: "/airports/" },
  { name: "airlines", path: "/airlines/" },
  { name: "users", path: "/users/" },
  { name: "flightPaths", path: "/flight-paths/" },
];

let collectionMocks;

beforeEach(() => {
  jest.clearAllMocks();

  const sampleDocument = {
    _id: new ObjectId(validId),
    name: "Test record",
  };

  collectionMocks = {};

  resources.forEach(({ name }) => {
    collectionMocks[name] = {
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([sampleDocument]),
      })),
      findOne: jest.fn().mockResolvedValue(sampleDocument),
    };
  });

  mongodb.getDb.mockReturnValue({
    collection: jest.fn((name) => collectionMocks[name]),
  });
});

describe("GET all routes", () => {
  test.each(resources)(
    "GET $path returns 200 and an array",
    async ({ path }) => {
      const response = await request(app).get(path);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    },
  );
});

describe("GET by ID routes", () => {
  test.each(resources)(
    "GET $path$validId returns 200 and a document",
    async ({ path }) => {
      const response = await request(app).get(`${path}${validId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Test record");
      expect(response.body).toHaveProperty("_id");
    },
  );
});

describe("GET by ID error handling", () => {
  test.each(resources)(
    "GET $path with an invalid ID returns 400",
    async ({ path }) => {
      const response = await request(app).get(`${path}not-a-valid-id`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    },
  );

  test.each(resources)(
    "GET $path with a valid but missing ID returns 404",
    async ({ name, path }) => {
      collectionMocks[name].findOne.mockResolvedValue(null);

      const response = await request(app).get(`${path}${validId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    },
  );

  test.each(resources)(
    "GET $path returns 500 when the database lookup fails",
    async ({ name, path }) => {
      collectionMocks[name].findOne.mockRejectedValue(
        new Error("Simulated database error"),
      );

      const response = await request(app).get(`${path}${validId}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    },
  );
});

describe("GET all error handling", () => {
  test.each(resources)(
    "GET $path returns 500 when the database query fails",
    async ({ name, path }) => {
      collectionMocks[name].find.mockReturnValue({
        toArray: jest
          .fn()
          .mockRejectedValue(new Error("Simulated database error")),
      });

      const response = await request(app).get(path);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    },
  );
});
