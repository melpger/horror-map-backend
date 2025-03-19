const mongoose = require('mongoose');
const validator = require('validator')
const cryptojs = require("crypto-js")
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')
//var uniqueValidator = require('mongoose-unique-validator');
const atob = require('atob');
const btoa = require('btoa');

// create user schema & model
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
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
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  refreshTokens: [{
    refreshToken: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    creationDate: {
      type: Date,
      required: true
    }
  }]
});

// Might delete this since the one using the api should be the one responsible for hashing
UserSchema.pre("save", function (next) {
  const user = this;
  return next();
  // if (this.isModified("password") || this.isNew) {
  //   bcrypt.genSalt(10, function (saltError, salt) {
  //     if (saltError) {
  //       return next(saltError);
  //     } else {
  //       bcrypt.hash(user.password, salt, function (hashError, hash) {
  //         if (hashError) {
  //           return next(hashError);
  //         }

  //         user.password = hash;
  //         next();
  //       })
  //     }
  //   });
  // } else {
  //   return next();
  // }
});

UserSchema.methods.generateAuthToken = async function (userAgent) {
  // Generate an auth token for the user
    
  const user = this;
  const user_id = this._id.toString();
  const creationDate = new Date;

  const token = jwt.sign({
    _id: user_id,
    creationDate : creationDate
  }, process.env.ACCESS_JWT_KEY, {
    expiresIn: '5m'
  });
  const refreshToken = jwt.sign({
    _id: user_id,
    creationDate : creationDate
  }, process.env.REFRESH_JWT_KEY, {
    expiresIn: '1d'
  });
  user.refreshTokens = user.refreshTokens.concat({
    refreshToken,
    userAgent,
    creationDate
  });
  await user.save();
  return token;
}

UserSchema.statics.isEmailUnique = async (email) => {
  const user = await User.findOne({
    email
  });
  if (user) {
    return false;
  }
  return true;
}

UserSchema.statics.isAdmin = async (email) => {
  const user = await User.findOne({
    email
  });
  if (user) {
    return false;
  }
  return true;
}

var keySize = 256;
var ivSize = 128;
var saltSize = 256;
var iterations = 1000;

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join("");
}

var decrypt = function (pass, message) {
  var hexResult = base64ToHex(message)

  var salt = cryptojs.enc.Hex.parse(hexResult.substr(0, 64));
  var iv = cryptojs.enc.Hex.parse(hexResult.substr(64, 32));
  var encrypted = hexToBase64(hexResult.substring(96));

  var key = cryptojs.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });

  var decrypted = cryptojs.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: cryptojs.pad.Pkcs7,
    mode: cryptojs.mode.CBC

  })

  return decrypted.toString(cryptojs.enc.Utf8);
};

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({
    email
  });
  if (!user) {
    const error = new Error();
    error.code = 10703;
    error.suberror_msg = 'Email does not exist.';
    throw error;
  }
  let isPasswordMatch = false;
  try {
    // console.log("pw", password)
    // isPasswordMatch =  decrypt(password, "Secret Message");
    var bytes = cryptojs.AES.decrypt(password, process.env.PW_KEY)
    var reqpw = bytes.toString(cryptojs.enc.Utf8);

    var bytes2 = cryptojs.AES.decrypt(user.password, process.env.PW_KEY)
    var dbpw = bytes2.toString(cryptojs.enc.Utf8);

    isPasswordMatch = (reqpw == dbpw);

  } catch (error) {
    // console.log(error);
  }

  if (!isPasswordMatch) {
    const error = new Error();
    error.code = 10704;
    error.suberror_msg = 'Password is wrong.';
    throw error;
  }

  return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;