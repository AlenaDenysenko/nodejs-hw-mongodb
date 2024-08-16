import createError from 'http-errors';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Contacts retrieved successfully',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Contact retrieved successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewContact = async (req, res, next) => {
  try {
    const contactData = req.body;
    const newContact = await createContact(contactData);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExistingContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactData = req.body;
    const updatedContact = await updateContact(contactId, contactData);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExistingContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContact(contactId);
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).json({
      status: 204,
      message: 'Successfully deleted a contact!',
    });
  } catch (error) {
    next(error);
  }
};
