// importing User model
const User = require("../models/User");
// lets create a server
const express = require("express");
// express router for creating our user routes
const router = express.Router();
// jwt for creating our jwt token
const jwt = require("jsonwebtoken");
// passport for user login strategies / options
const passport = require("passport");
// loading passport strategies from config folder
require("../config/auth")(passport);

/**
 * this route finds one user
 * @param {number} id
 * @returns {object} status && json
 */

router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.params.id) {
      res.status(400).send({
        success: false,
        message: "a member id is required to find a user"
      });
    } else {
      User.findById({ _id: req.params.id }, (err, user) => {
        if (err) {
          res.status(400).send({
            err,
            success: false,
            message: "We are unable to process your request. Please try again"
          });
        } else {
          res.status(200).send({
            success: true,
            message: "we found the user",
            user: { name: user.name, email: user.email }
          });
        }
      });
    }
  }
);

/**
 * This route logs in / authenticates a user
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @returns {object} status && json
 */

router.post("/login", (req, res) => {
  if (!req.body.email) {
    res.status(400).send({
      success: false,
      message: "email is a required field"
    });
  } else {
    if (!req.body.password) {
      res.status(400).send({
        success: false,
        message: "password is a required field"
      });
    } else {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
          res.status(400).send({
            err,
            success: false,
            message: "We are unable to process your request. Please try again"
          });
        } else {
          if (user) {
            user.verifyPassword(req.body.password, (err, isMatch) => {
              if (err) {
                res.status(400).send({
                  err,
                  success: false,
                  message: "We were unable to verify the password you submitted"
                });
              } else {
                if (isMatch) {
                  const token = jwt.sign(
                    {
                      id: user._id,
                      name: user.name,
                      email: user.email,
                      role: user.role
                    },
                    process.env.JWT_TOKEN,
                    { expiresIn: "1h" }
                  );
                  res.status(200).send({
                    token,
                    success: true,
                    message: "Authentication Successfull"
                  });
                } else {
                  res.status(401).send({
                    success: false,
                    message: "Authentication failed. Incorrect password."
                  });
                }
              }
            });
          } else {
            res.status(400).send({
              success: false,
              message: "Email does not exist in our database"
            });
          }
        }
      });
    }
  }
});

/**
 * This route adds a new user to our db
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @return {object}
 */
router.post("/add", (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      success: false,
      message: "name is a required field"
    });
  } else {
    if (!req.body.email) {
      res.status(400).send({
        success: false,
        message: "email is a required field"
      });
    } else {
      if (!req.body.password) {
        res.status(400).send({
          success: false,
          message: "password is a required field"
        });
      } else {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) {
            res.status(400).send({
              err,
              success: false,
              message: "We are unable to process your request. Please try again"
            });
          } else {
            if (!user) {
              User.create(
                {
                  name: req.body.name,
                  email: req.body.email,
                  password: req.body.password
                },
                (err, user) => {
                  if (err) {
                    res.status(400).send({
                      err,
                      success: false,
                      message: "registration failed view error"
                    });
                  } else {
                    res.status(201).send({
                      success: true,
                      message: "registration successfull"
                    });
                  }
                }
              );
            } else {
              res.status(400).send({
                success: false,
                message:
                  "there is already a user in our database with that email"
              });
            }
          }
        });
      }
    }
  }
});

/**
 * this rout initiates the google passport strategy
 */
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"]
  })
);

/**
 * this route is for the google strategy callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false
  }),
  (req, res) => {
    if (!req.user.googleId) {
      User.create(
        {
          googleId: req.user.id,
          name: `${req.user.name.familyName} ${req.user.name.givenName}`,
          email: req.user.emails[0].value
        },
        (err, user) => {
          if (err) {
            res.status(400).send({
              err,
              succes: false,
              message: "We are unable to process your request. Please try again"
            });
          } else {
            if (user) {
              const token = jwt.sign(
                {
                  name: user.name,
                  email: user.email
                },
                process.env.JWT_TOKEN,
                { expiresIn: "1h" }
              );
              res.status(200).send({
                user,
                token,
                succes: true,
                message: "Authentication successfull"
              });
            } else {
              res.status(401).send({
                succes: false,
                message: "Authentication failed. Try again"
              });
            }
          }
        }
      );
    } else {
      res.status(401).send({
        succes: false,
        message: "Authentication failed. Try again"
      });
    }
  }
);

module.exports = router;
