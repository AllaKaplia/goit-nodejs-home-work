const express = require('express');

const contr = require('../../controllers/contacts');

const { validateBody } = require('../../middlewares');
const schema = require('../../schemas/contacts');

const router = express.Router();


router.get('/', contr.getAllContacts);

router.get('/:contactId', contr.getContactById);

router.post('/', validateBody(schema.schema), contr.addContact);

router.delete('/:contactId', contr.deleteContact);

router.put('/:contactId', validateBody(schema.schema), contr.updateContact);

module.exports = router;