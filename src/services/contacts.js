import { Contact } from '../models/contact.js';

export const getAllContacts = async (filters = {}) => {
  return await Contact.find(filters);
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (id, contactData) => {
  return await Contact.findByIdAndUpdate(id, contactData, { new: true });
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

