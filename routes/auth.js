const express = require("express");
const passport = require("../config/passport");

const router = express.Router();

// Start GitHub login
router.get("/github", (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Sign in with GitHub'
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

// GitHub redirects the user here after authorization
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login-failed",
  }),
  (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.summary = 'Complete GitHub authentication'
    res.status(200).json({
      message: "Successfully authenticated with GitHub.",
      user: {
        id: req.user._id,
        username: req.user.username,
        displayName: req.user.displayName,
      },
    });
  },
);

// Check whether the current session is authenticated
router.get("/status", (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Check authentication status'

  if (!req.isAuthenticated()) {
    return res.status(401).json({
      authenticated: false,
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName,
    },
  });
});

// Handle failed login
router.get("/login-failed", (req, res) => {
  res.status(401).json({
    error: "GitHub authentication failed.",
  });
});

// Log out the current user
router.post("/logout", (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Log out'

  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({
        message: "Successfully logged out.",
      });
    });
  });
});

module.exports = router;
