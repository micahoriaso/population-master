import User from '../models/user.model';
import Location from '../models/location.model';

export const isEmailUnique = async (email) => {
  const user = await User.find({ email }).exec();
  return user.length <= 0
}

export const isUserExisting = async (email) => {
  const user = await User.find({ email }).exec();
  return user.length > 0
}

export const isLocationExisting = async (id) => {
  const location = await Location.find({ _id:id }).exec();
  return location.length > 0
}
