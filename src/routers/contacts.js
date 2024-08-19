import express from 'express';
import { getContacts, getContact, createNewContact, updateExistingContact, deleteExistingContact } from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js'; 
import { validateBody, contactSchema } from '../validation/contactValidation.js';

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', isValidId, getContact); 
router.post('/', validateBody(contactSchema), createNewContact); 
router.patch('/:contactId', isValidId, validateBody(contactSchema), updateExistingContact); 
router.delete('/:contactId', isValidId, deleteExistingContact); 

export { router as contactsRouter };



