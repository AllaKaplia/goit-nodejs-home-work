const express = require('express');

const contr = require('../../controllers/contacts');

const { validateBody, isValidId, validateBodyFavorite } = require('../../middlewares');
const { schemas } = require('../../models/contact');

const router = express.Router();


router.get('/', contr.getAllContacts);

router.get('/:contactId',isValidId, contr.getContactById);

router.post('/', validateBody(schemas.addSchema), contr.addContact);

router.delete('/:contactId', isValidId, contr.deleteContact);

router.put('/:contactId', isValidId, validateBody(schemas.addSchema), contr.updateContact);

router.patch('/:contactId/favorite', isValidId, validateBodyFavorite(schemas.updateFavoriteSchema), contr.updateFavorite);

module.exports = router;