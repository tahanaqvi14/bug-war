const Joi = require('joi');
// Joi in JavaScript is a library used to validate data — like checking if a user's input is correct before saving it or sending it to the backend.

const bcrypt = require('bcrypt');
// bcrypt is used to hash passwords so they are stored safely in the database.

const userModel = require('../models/user'); 
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async function (req, res) {
    try {
        let {displayname, username, password}=req.body;
        let user_already=userModel.findOne({username:username});
        if(user_already){
            res.send('User already exists');
        }else{
            // Validate input using Joi
            const userschema=joi.object({
                displayname:joi.string().min(1).required(),
                username:joi.string().min(1).required(),
                password:joi.string().min(8).required()
            })
            const {error}=userschema.validate({displayname, username, password});
            if(error){
                res.send('Please fill correctly');
            }
            else{
                //start from here can't do more broo 6:37am 23/07/2025
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
            }
        }
    
    } catch (error) {
        
    }
}
