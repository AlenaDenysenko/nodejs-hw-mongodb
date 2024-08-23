import { Contact } from '../models/contact.js';

export const getAllContacts = async (filters = {}) => {
  return await Contact.find(filters);
};

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (id, userId, contactData) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, contactData, { new: true });
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};

