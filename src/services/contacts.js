import mongoose from 'mongoose';
import createError from 'http-errors';
import { Contact } from '../models/contact.js';

const getAllContacts = async () => {
  return await Contact.find();
}

const getContactById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'Invalid ID format');
  }
  
  const contact = await Contact.findById(id);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  return contact;
}

const createContact = async (contactData) => {
  return await Contact.create(contactData);
}

export { getAllContacts, getContactById, createContact };
