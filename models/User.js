// importing mongoose to access Schema
const mongoose = require('mongoose')
// Schema will help use build our mongodb schemas
const Schema = mongoose.Schema
// bcrypt will help us hash and compare passwords
const bcrypt = require('bcrypt')
const saltRounds = 10

// creating our user schema
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        default: ''
    },
    role: {
        type: String,
        enum: ['client', 'premium'],
        default: 'client'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    googleId: {
        type: String
    }
})

// pre hook for hashing our password before saving
UserSchema.pre('save', function(next) {
    let user = this
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err)
                }
                user.password = hash
                next()
            })
        })
    } else {
        return next()
    }
})

// method for comparing password from login request
UserSchema.methods.verifyPassword = function(pw, cb) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if (err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

// exporting our model
module.exports = mongoose.model('User', UserSchema)
