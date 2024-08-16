import { Contact } from '../models/contact.js';
import mongoose from 'mongoose';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await Contact.findById(id);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (id, contactData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await Contact.findByIdAndUpdate(id, contactData, { new: true });
};

export const deleteContact = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  return await Contact.findByIdAndDelete(id);
};
