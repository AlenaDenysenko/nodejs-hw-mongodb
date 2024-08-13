import mongoose from 'mongoose';
import { Contact } from '../models/contact.js';

const getAllContacts = async () => {
  return await Contact.find();
}

const getContactById = async (id) => {
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }

  
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new Error('Contact not found');
  }

  return contact;
}

export { getAllContacts, getContactById };