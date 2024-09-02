import express from 'express';
import { 
  wrappedRegister as register, 
  wrappedLogin as login, 
  wrappedRefresh as refresh, 
  wrappedLogout as logout, 
  wrappedSendResetEmail as sendResetEmail, 
  wrappedResetPassword as resetPassword 
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userSchema, loginSchema, resetPasswordSchema } from '../validation/authValidation.js';

const router = express.Router();

router.post('/register', validateBody(userSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/send-reset-email', sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

export { router as authRouter };




