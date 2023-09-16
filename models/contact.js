const { Schema, model } = require('mongoose');
const {handleMongooseError} = require('../helpers');
const Joi = require('joi');


const nameRegex = /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

const contactSchema = new Schema({
  name: {
    type: String,
    math: nameRegex,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    math: emailRegex,
    required: [true, 'Set email for contact'],
  },
  phone: {
    type: String,
    math: phoneRegex,
    required: [true, 'Set phone for contact'],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
}, {versionKey: false, timestamps: true});

contactSchema.post('save', handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().pattern(nameRegex).required().messages({ "any.required": "Missing required name field" }),
  email: Joi.string().pattern(emailRegex).required().messages({ "any.required": "Missing required email field" }),
  phone: Joi.string().pattern(phoneRegex).required().messages({ "any.required": "Missing required phone field" }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({ "any.required": "Missing field favorite" }),
})

const schemas = {
  addSchema,
  updateFavoriteSchema,
}

const Contact = model('contact', contactSchema);

module.exports = {
  Contact,
  schemas,
};