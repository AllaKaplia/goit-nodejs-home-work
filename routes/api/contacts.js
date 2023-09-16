const express = require('express');

const contr = require('../../controllers/contacts');

const { validateBody, isValidId, validateBodyFavorite, authenticate } = require('../../middlewares');
const { schemas } = require('../../models/contact');

const router = express.Router();


router.get('/', authenticate, contr.getAllContacts);

router.get('/:contactId', authenticate, isValidId, contr.getContactById);

router.post('/', authenticate, validateBody(schemas.addSchema), contr.addContact);

router.delete('/:contactId', authenticate, isValidId, contr.deleteContact);

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), contr.updateContact);

router.patch('/:contactId/favorite', authenticate, isValidId, validateBodyFavorite(schemas.updateFavoriteSchema), contr.updateFavorite);

module.exports = router;