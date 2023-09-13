const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().required().messages({ "any.required": "Missing required name field" }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({ "any.required": "Missing required email field" }),
    phone: Joi.string().pattern(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/).required().messages({ "any.required": "Missing required phone field" })
});

module.exports = {
    schema,
}