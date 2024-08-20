import express from 'express';
import {
  getContacts,
  getContact,
  createNewContact,
  updateExistingContact,
  deleteExistingContact,
} from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import { validateBody, contactSchema } from '../validation/contactValidation.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate); 

router.get('/', getContacts);
router.get('/:contactId', isValidId, getContact);
router.post('/', validateBody(contactSchema), createNewContact);
router.patch('/:contactId', isValidId, validateBody(contactSchema), updateExistingContact);
router.delete('/:contactId', isValidId, deleteExistingContact);

export { router as contactsRouter };



