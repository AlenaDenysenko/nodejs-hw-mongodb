import express from 'express';
import { wrappedRegister as register, wrappedLogin as login, wrappedRefresh as refresh, wrappedLogout as logout } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userSchema, loginSchema } from '../validation/authValidation.js';

const router = express.Router();

router.post('/register', validateBody(userSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export { router as authRouter };



