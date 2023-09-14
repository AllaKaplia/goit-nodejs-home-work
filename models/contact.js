const { Schema, model } = require('mongoose');
const {handleMongooseError} = require('../helpers');
const Joi = require('joi');


const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    required: [true, 'Set email for contact'],
  },
  phone: {
    type: String,
    required: [true, 'Set phone for contact'],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {versionKey: false, timestamps: true});

contactSchema.post('save', handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().required().messages({ "any.required": "Missing required name field" }),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({ "any.required": "Missing required email field" }),
  phone: Joi.string().pattern(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/).required().messages({ "any.required": "Missing required phone field" }),
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