import createError from 'http-errors';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const getContacts = ctrlWrapper(async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Contacts retrieved successfully',
    data: contacts,
  });
});

export const getContact = ctrlWrapper(async (req, res) => {
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
});

export const createNewContact = ctrlWrapper(async (req, res) => {
  const contactData = req.body;
  const newContact = await createContact(contactData);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

export const updateExistingContact = ctrlWrapper(async (req, res) => {
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
});

export const deleteExistingContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).json({
    status: 204,
    message: 'Successfully deleted a contact!',
  });
});
