const {Contact} = require('../models/contact');
const { HttpError, contrWrapper } = require('../helpers');


const getAllContacts = async (req, res) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 6} = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({owner}, '-createdAt -updatedAt', {skip, limit}).populate('owner', 'email subscription');
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId, '-createdAt -updatedAt');

    if (!result) {
      throw HttpError(404, 'Not Found');
    }

    res.json(result);
};

const addContact = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
};

const deleteContact = async (req, res) => { 
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if(!result) {
        throw HttpError(404, 'Not Found');
    };
  
    res.status(200).json({message:'Contact deleted'});
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
  
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  
    if (!result) {
        throw HttpError(404, 'Not found');
    }
  
    res.json(result);
};

const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
  
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  
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
    updateFavorite: contrWrapper(updateFavorite),
}