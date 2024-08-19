// src/pagination/paginationUtils.js
import { Contact } from '../models/contact.js';

export const paginate = async (modelFunction, page, perPage, sortBy, sortOrder, filters) => {
  const skip = (page - 1) * perPage;

  // Використовуємо модель Contact безпосередньо для створення запиту
  const totalItems = await Contact.countDocuments(filters); // Підрахунок загальної кількості документів
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const data = await Contact.find(filters)  // Використання Contact.find для створення запиту
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage)
    .exec();  // Використання exec для виконання запиту

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



