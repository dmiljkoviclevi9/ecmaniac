import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from 'crypto';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return validator.isLength(value, { min: 3, max: 16 });
      },
      message: "Username must be between 3 and 16 characters long.",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Email is invalid.",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value, {
          minLength: 8,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message: "Password is not strong enough. minLen: 8, minUpper: 1, minNum: 1, minSym: 1.",
    },
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  role: {
    type: String,
    required: true,
    enum: ['USER', 'ADMIN']
  },
  verificationToken: {
    type: String,
    required: false,
  },
  verificationTokenExpires: {
    type: Date,
    required: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateVerificationToken = function() {
  const user = this;
  // Generate a random token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  // Set the token and its expiration time (e.g., 24 hours from now)
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = Date.now() + 24*60*60*1000; // 24 hours

  return verificationToken;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Unable to login. User not found.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login. Incorrect password.');
    }

    return user;
  } catch (err) {
    throw err;
  }
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }

  if (!user.role) { // Checks if 'role' is not set
    user.role = "USER"; // Sets the default role to 'USER'
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;