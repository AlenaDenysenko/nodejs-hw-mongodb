import express from 'express';
import { 
  getContacts, 
  createNewContact, 
  getContact, 
  deleteExistingContact, 
  updateExistingContact 
} from '../controllers/contacts.js';
import { upload } from '../config/cloudinary.js';
import authenticate from '../middlewares/authenticate.js'; 

const router = express.Router();

router.get('/', authenticate, getContacts);
router.post('/', authenticate, upload.single('photo'), createNewContact); 
router.get('/:contactId', authenticate, getContact); 
router.delete('/:contactId', authenticate, deleteExistingContact); 
router.patch('/:contactId', authenticate, upload.single('photo'), updateExistingContact); 

export { router as contactsRouter };





