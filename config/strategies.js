// will help use create the google stretegy
const GoogleStrategy = require('passport-google-oauth20').Strategy
// importing User model
const User = require('../models/User')

// method that will help use authenticate a google plus user
module.exports = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/user/google/callback'
            },
            function(accessToken, refreshToken, profile, done) {
                User.findOne({ googleId: profile.id }, (err, user) => {
                    if (err) {
                        return done(null, err)
                    } else {
                        if (user) {
                            return done(null, user)
                        } else {
                            return done(null, profile)
                        }
                    }
                })
            }
        )
    )
}
