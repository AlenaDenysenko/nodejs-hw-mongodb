import express from 'express';
import { getContacts, getContact, createNewContact, updateExistingContact, deleteExistingContact } from '../controllers/contacts.js';

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', getContact);
router.post('/', createNewContact);
router.patch('/:contactId', updateExistingContact);
router.delete('/:contactId', deleteExistingContact);

export { router as contactsRouter };


