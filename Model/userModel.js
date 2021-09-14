const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require("bcryptjs")
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')

// create user schema & model
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({
          error: 'Invalid Email address'
        })
      }
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 7
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

// Might delete this since the one using the api should be the one responsible for hashing
UserSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        })
      }
    });
  } else {
    return next();
  }
});

UserSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}


UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({
    email
  });
  if (!user) {
    throw new Error({
      error: 'Invalid login credentials'
    });
  }
  
  const isPasswordMatch = await bcrypt.compare(password, user.password)

  if (!isPasswordMatch) {
    throw new Error({
      error: 'Invalid login credentials'
    });
  }
  
  return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;