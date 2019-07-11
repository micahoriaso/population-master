import express from 'express';
import {validations} from '../models/location.model';
import {checkValidationResult} from '../middlewares/checkValidationResult'
import {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne} from '../controllers/location.controller';


const router = express.Router();

router.post('/', validations.create);
router.post('/', checkValidationResult);
router.post('/', create);

router.get('/', getAll);

router.get('/:id', getOne);

router.put('/:id', validations.update);
router.put('/:id', checkValidationResult);
router.put('/:id', updateOne);

router.delete('/:id', deleteOne);

export default router;
