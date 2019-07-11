import mongoose from 'mongoose';
import {check} from 'express-validator';
import {isEmailUnique} from '../helpers/validators'

const Schema = mongoose.Schema;

export const validations =
{
  register:
  [
    // Name input
    check('name', 'Invalid name')
    .isAlphanumeric()
    .withMessage('Must be a string')
    .isLength({ min: 2 })
    .withMessage('Must be at least 2 characters long'),

    // Email input
    check('email', 'Invalid email address')
    .isEmail()
    .custom( async value => {
      if (! await isEmailUnique(value)) {
        return Promise.reject('Email has been used')
      }
    }),

    // password input
    check('password', 'Password must be at least 8 characters long')
    .isString()
    .withMessage('Password must be a string')
    .custom( async value => {
      if (value.trim() === '') {
        return Promise.reject('Password must be a string')
      }
    })
    .isLength({ min: 8 }),
  ],
  login:
  [
    // Phone input
    check('email', 'Invalid login credentials')
    .isString(),

    // password input
    check('password', 'Invalid login credentials')
    .isString()
  ]
};


let UserSchema = new Schema({
    name: {type: String, required: true, max: 100},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});


export default mongoose.model('User', UserSchema);