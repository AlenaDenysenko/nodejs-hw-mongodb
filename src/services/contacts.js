import mongoose from 'mongoose';
import { Contact } from '../models/contact.js';

const getAllContacts = async () => {
  return await Contact.find();
}

const getContactById = async (id) => {
 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  
 
  return await Contact.findById(mongoose.Types.ObjectId(id));
}

export { getAllContacts, getContactById };
