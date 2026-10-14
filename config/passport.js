const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const users = mongodb.getDb().collection("users");

        const userData = {
          githubId: profile.id,
          username: profile.username || "",
          displayName: profile.displayName || profile.username || "GitHub User",
          email: profile.emails?.[0]?.value || null,
        };

        await users.updateOne(
          { githubId: profile.id },
          { $set: userData },
          { upsert: true },
        );

        const user = await users.findOne({
          githubId: profile.id,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    if (!ObjectId.isValid(id)) {
      return done(null, false);
    }

    const user = await mongodb
      .getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    return done(null, user || false);
  } catch (error) {
    return done(error, null);
  }
});

module.exports = passport;
