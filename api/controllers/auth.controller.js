import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { companyname, username, email, password, role, address, description, contactno } = req.body;
    if( !companyname || !username || !email || !password || !role || !address || !description || !contactno || companyname==='' || username === '' || email === '' || password === '' || role==='' || address==='' || description==='' || contactno==='' )
        {
            next(errorHandler(403, 'All fields are required'));
        }

        const hashedPassword=bcryptjs.hashSync(password, 10)

        const newUser = User({ 
            companyname,
            username,
            email,
            password: hashedPassword,
            role,
            address,
            description, 
            contactno,
        });
        try {
            await newUser.save();
            res.json('Signup successfully');
        } catch (error) {
            next(error);
        }
}


export const signin = async (req, res, next) => {
    const {email, password }= req.body;
    if(!email || !password || email === '' || password === '')
    {
     next(errorHandler(403, 'All feild are required'));
    }

    
    try {
        const validUser =  await User.findOne({ email });
        if(!validUser)
        {
            next(errorHandler(400, 'User Not Found'));
        } 
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
          return next(errorHandler(400, 'Invalid password'));
        } 
        
        const token = jwt.sign(
            {    
                id: validUser._id, 
            }, process.env.JWT_SECRET
        );
        const {password: pass, ...rest} = validUser._doc;
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(rest);
    } catch (error) {
        next(error);
    }
}