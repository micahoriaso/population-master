import mongoose from 'mongoose';
import {check} from 'express-validator';
import {isLocationExisting} from '../helpers/validators'

const Schema = mongoose.Schema;

export const validations =
{
  create:
  [
    // Name input
    check('name', 'Invalid name')
    .isAlphanumeric()
    .withMessage('Must be a string')
    .custom( async value => {
      if (value.trim() === '') {
        return Promise.reject('Name must be a string')
      }
    }),

    // Parent input
    check('parentId', 'Invalid parent')
    .optional()
    .custom( async value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return Promise.reject('Invalid parent id')
      }
    })
    .custom( async value => {
      if (! await isLocationExisting(value)) {
        return Promise.reject('Location does not exist')
      }
    }),


    // male input
    check('male', 'Invalid male number')
    .isInt()
    .custom( async value => {
      if (value < 0 || value > 10000000) {
        return Promise.reject('Male number must be between 0 and 10,000,000')
      }
    }),

    // female input
    check('female', 'Invalid female number')
    .isInt()
    .custom( async value => {
      if (value < 0 || value > 10000000) {
        return Promise.reject('Female number must be between 0 and 10,000,000')
      }
    })
  ],
  update:
  [
    // Name input
    check('name', 'Invalid name')
    .optional()
    .isAlphanumeric()
    .withMessage('Must be a string')
    .custom( async value => {
      if (value.trim() === '') {
        return Promise.reject('Name must be a string')
      }
    }),

    // Parent input
    check('parentId', 'Invalid parent')
    .optional()
    .custom( async value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return Promise.reject('Invalid parent id')
      }
    })
    .custom( async value => {
      if (! await isLocationExisting(value)) {
        return Promise.reject('Location does not exist')
      }
    }),


    // male input
    check('male', 'Invalid male number')
    .optional()
    .isInt()
    .custom( async value => {
      if (value < 0 || value > 10000000) {
        return Promise.reject('Male number must be between 0 and 10,000,000')
      }
    }),

    // female input
    check('female', 'Invalid female number')
    .optional()
    .isInt()
    .custom( async value => {
      if (value < 0 || value > 10000000) {
        return Promise.reject('Female number must be between 0 and 10,000,000')
      }
    })
  ],
};

let LocationSchema = new Schema({
    parentId: {type: String, max: 255},
    name: {type: String, required: true, max: 140},
    male: {type: Number, required: true},
    female: {type: Number, required: true},
    total: {type: Number},
});


export default mongoose.model('Location', LocationSchema);