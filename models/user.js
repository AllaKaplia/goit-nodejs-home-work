const { Schema, model } = require('mongoose');
const {handleMongooseError} = require('../helpers');
const Joi = require('joi');

const subscriptionList = ["starter", "pro", "business"];
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema({
    password: {
      type: String,
      minlength: 8,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter"
    },
    token: {
      type: String,
      default: ''
    }
}, {versionKey: false, timestamps: true})

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
    password: Joi.string().min(8).required().messages({ "any.required": "Missing required password field" }),
    email: Joi.string().email(emailRegex).required().messages({ "any.required": "Missing required email field"}),
    subscription: Joi.string().valid(...subscriptionList).default("starter")
});

const loginSchema = Joi.object({
    email: Joi.string().email(emailRegex).required().messages({ "any.required": "Missing required email field"}),
    password: Joi.string().min(8).required().messages({ "any.required": "Missing required password field" }),
});

const schemas = {
    registerSchema,
    loginSchema,
};

const User = model('user', userSchema);

module.exports = {
    User,
    schemas,
};