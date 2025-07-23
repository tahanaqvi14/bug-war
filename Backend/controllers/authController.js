const Joi = require('joi');
// Joi in JavaScript is a library used to validate data — like checking if a user's input is correct before saving it or sending it to the backend.

const bcrypt = require('bcrypt');
// bcrypt is used to hash passwords so they are stored safely in the database.



const userModel = require('../models/user'); 
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async function (req, res) {
    try {
        let { email, fullname, password } = req.body;
        let user1 = await userModel.findOne({ email: email });

        if (user1) {
            req.flash('error', 'Email already exists');
            return res.redirect('/');
        }

        // Validate input using Joi
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            fullname: Joi.string().min(3).required(),
            password: Joi.string().min(6).required()
        });

        const { error } = userSchema.validate({ fullname, email, password });
        if (error) {
            req.flash('error', error.details[0].message);
            return res.redirect('/');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create the user
        await userModel.create({ fullname, email, password: hash });

        req.flash('success', 'Account created successfully. You can now log in.');
        return res.redirect('/');
        
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while processing your request');
        return res.redirect('/');
    }
};

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });

    if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/');
    }

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user);
            res.cookie('token', token);
            return res.redirect('/shop'); // Redirect to shop after successful login
        } else {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/');
        }
    });
};
