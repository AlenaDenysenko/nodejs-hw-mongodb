import { Contact } from '../models/contact.js';

export const paginate = async (modelFunction, page, perPage, sortBy, sortOrder, filters) => {
  const skip = (page - 1) * perPage;

  const totalItems = await Contact.countDocuments(filters);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const data = await Contact.find(filters)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage)
    .exec();

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};




