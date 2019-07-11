import checkAPIs from 'express-validator';

export function checkValidationResult(req, res, next)
{
  const errors = checkAPIs.validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).send(errors.mapped());
  }

  return next();
}
