
import jwt from 'jsonwebtoken';

export const signJWT = (user) => {
  const payload = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email
    };
  const privateKEY = process.env.JWT_SECRET_KEY;
  const signOptions = {
    expiresIn: '2h',
  };
  return jwt.sign(payload, privateKEY, signOptions);
};

export const decodeJWT = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return res.status(401)
              .send({message: 'Sorry, you dont have permission for this resource'});
  }
};
