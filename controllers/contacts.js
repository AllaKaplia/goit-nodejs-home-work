const contacts = require('../models/contacts');
const { HttpError, contrWrapper } = require('../helpers');

const getAllContacts = async (req, res) => {
    const result = await contacts.listContacts();
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);

    if (!result) {
      throw HttpError(404, 'Not Found');
    }

    res.json(result);
};

const addContact = async (req, res) => {
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
};

const deleteContact = async (req, res) => { 
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if(!result) {
        throw HttpError(404, 'Not Found');
    };
  
    res.status(200).json({message:'Contact deleted'});
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
  
    const result = await contacts.updateContact(contactId, req.body);
  
    if (!result) {
        throw HttpError(404, 'Not found');
    }
  
    res.json(result);
};

module.exports = {
    getAllContacts: contrWrapper(getAllContacts),
    getContactById: contrWrapper(getContactById),
    addContact: contrWrapper(addContact),
    deleteContact: contrWrapper(deleteContact),
    updateContact: contrWrapper(updateContact),
}