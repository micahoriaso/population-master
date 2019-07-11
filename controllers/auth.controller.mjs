import User from '../models/user.model';
import bcrypt from 'bcrypt';
import {signJWT} from '../helpers/jwt'

export const register = async (req, res, next) => {
    const passwordHash = bcrypt.hashSync(
        req.body.password,
        10
    );

    let user = new User(
        {
            name: req.body.name,
            email: req.body.email,
            password: passwordHash
        }
    );

    user.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(201).send({message: 'Account created successfully'})
    })
};

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    const user = await User.find({ email }).exec();

    if (user.length < 1)
        return res.status(401).send({message:'Invalid login credentials'});

    const match = await bcrypt.compare(password, user[0].password);
    if (!match)
        return res.status(401).send({message:'Invalid login credentials'});

    try {
        const token = signJWT(user);
        res.status(200).send({token});
    } catch (error) {
      console.log(error);
    }
};