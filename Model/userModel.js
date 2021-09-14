const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const Schema = mongoose.Schema;

// create user schema & model
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

// Might delete this since the one using the api should be the one responsible for hashing
UserSchema.pre("save", function (next){
    const user = this;

    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
          if (saltError) {
            return next(saltError)
          } else {
            bcrypt.hash(user.password, salt, function(hashError, hash) {
              if (hashError) {
                return next(hashError)
              }
    
              user.password = hash
              next()
            })
          }
        })
      } else {
        return next()
      }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
