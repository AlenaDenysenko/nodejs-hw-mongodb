import createError from 'http-errors';
import {
  getAllContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { paginate } from '../pagination/paginationUtils.js';

export const getContacts = ctrlWrapper(async (req, res) => {
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
  const { _id: userId } = req.user; 

  if (isNaN(page) || isNaN(perPage)) {
    throw createError(400, 'Page and perPage should be numbers');
  }

  const filters = { userId }; 
  if (type) filters.contactType = type;
  if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

  const {
    data,
    page: currentPage,
    perPage: currentPerPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  } = await paginate(
    getAllContacts,
    parseInt(page),
    parseInt(perPage),
    sortBy,
    sortOrder,
    filters
  );

  if (data.length === 0) {
    throw createError(404, 'No contacts found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data,
      page: currentPage,
      perPage: currentPerPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
});

export const createNewContact = ctrlWrapper(async (req, res) => {
  const { _id: userId } = req.user; 
  const contactData = { ...req.body, userId }; 

  if (!contactData.name) {
    throw createError(400, 'Name is required');
  }

  const newContact = await createContact(contactData);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

export const deleteExistingContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user; 

  const deletedContact = await deleteContact(contactId, userId); 
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).json({
    status: 204,
    message: 'Successfully deleted a contact!',
  });
});

export const updateExistingContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user; 
  const contactData = req.body;

  const updatedContact = await updateContact(contactId, contactData, userId); 
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: updatedContact,
  });
});

export const getContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user; 

  const contact = await getContactById(contactId, userId); 
  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Contact retrieved successfully',
    data: contact,
  });
});
