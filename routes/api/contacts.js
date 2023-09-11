const express = require('express');
const Joi = require('joi');

const contacts = require('../../models/contacts');
const { HttpError } = require('../../helpers');

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().required().messages({ "any.required": "missing required name field" }),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({ "any.required": "missing required email field" }),
  phone: Joi.string().pattern(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/).required().messages({ "any.required": "missing required phone field" })
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);

    if (!result) {
      throw HttpError(404, 'Not Found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if(error) {
      throw HttpError(400, 'Missing required name field');
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if(!result) {
      throw HttpError(404, 'Not Found');
    };

    res.status(200).json({message:'Contact deleted'});
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = schema.validate(req.body);

    if (!req.body) {
      throw HttpError(400, 'Missing request body');
    } else if (error) {
      const errorMessage = error.details[0].message;
      throw HttpError(400, errorMessage);
    }

    const result = await contacts.updateContact(contactId, req.body);

    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;