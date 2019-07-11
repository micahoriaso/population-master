import express from 'express';
import {validations} from '../models/user.model';
import {checkValidationResult} from '../middlewares/checkValidationResult'
import { login, register } from '../controllers/auth.controller';

const router = express.Router();


router.post('/register', validations.register);
router.post('/register', checkValidationResult);
router.post('/register', register);

router.post('/login', validations.login);
router.post('/login', checkValidationResult);
router.post('/login', login)

export default router;