// src/routers/contacts.js
import express from 'express';
import { getContacts, getContact, createNewContact, updateExistingContact, deleteExistingContact } from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js'; // Імпорт middleware для перевірки ID
import { validateBody, contactSchema } from '../validation/contactValidation.js';

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', isValidId, getContact); // Використання middleware для перевірки ID
router.post('/', validateBody(contactSchema), createNewContact); // Використання валідаційного middleware
router.patch('/:contactId', isValidId, validateBody(contactSchema), updateExistingContact); // Використання обох middleware
router.delete('/:contactId', isValidId, deleteExistingContact); // Використання middleware для перевірки ID

export { router as contactsRouter };



