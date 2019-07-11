import mongoose from 'mongoose';
import Location from '../models/location.model';

export const create = async (req, res, next) => {
  const {name, parentId=null, male, female} = req.body;

  const total = Number(male) + Number(female);

  let location = new Location({
    name,
    parentId,
    male,
    female,
    total
  })

  location.save(function (err) {
    if (err) {
        return next(err);
    }
    res.status(201).send({message : 'Location saved successfully'});
  })
}

export const getAll = async (req, res, next) => {
  const locations =  await Location.find().exec();

  if (locations.length < 1)
    return res.status(404).send({message: 'There are no locations added yet'})

  res.status(200).send({locations : locations});
}


export const getOne = async (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({message: 'Invalid location id'})

  const location =  await Location.findById(req.params.id).exec();

  if (!location)
    return res.status(404).send({message: 'Location does not exist'})

  res.status(200).send({location : location});
}

export const updateOne = async (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({message: 'Invalid location id'})

  if (Object.keys(req.body).length < 1)
    return res.status(400).send({message: 'No data provided'})

  const location =  await Location.findById(req.params.id).exec();

  if (!location)
    return res.status(404).send({message: 'Location does not exist'})

  if (String(location._id) === req.body.parentId)
    return res.status(404).send({message: 'Location cannot be a parent of itself'})

  const updatedName = req.body.name || location.name;
  const updatedMale = req.body.male || location.male;
  const updatedFemale = req.body.female || location.female;
  const updatedParentId = req.body.parentId || location.parentId;

  location.name = updatedName;
  location.male = updatedMale;
  location.female = updatedFemale;
  location.parentId = updatedParentId;
  location.total = Number(updatedMale) + Number(updatedFemale)

  await location.save();
  res.status(200).send({message : 'Location updated'});
}

export const deleteOne = async (req, res, next) => {
  const locationId = req.params.id;

  if(!mongoose.Types.ObjectId.isValid(locationId))
    return res.status(400).send({message: 'Invalid location id'})

  const location =  await Location.findById(locationId).exec();

  if (!location)
    return res.status(404).send({message: 'Location does not exist'})

  await Location.updateMany({parentId: locationId}, {parentId: null});

  await Location.deleteOne({_id: locationId});

  res.status(200).send({message : 'Location deleted'});
}
