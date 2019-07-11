import {decodeJWT} from '../helpers/jwt';

export const checkJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const tokenArray = token.split(' ');
    if (! decodeJWT(tokenArray[1]))
      return res.status(401)
              .send({message: 'Sorry, token is invalid'});

    const {payload} = decodeJWT(tokenArray[1]);
    req.user = payload;
    next();
  } else {
    return res.status(401)
              .send({message: 'Sorry, auth token is not provided'});
  }
};