const Joi = require('joi');
// Joi in JavaScript is a library used to validate data — like checking if a user's input is correct before saving it or sending it to the backend.

const bcrypt = require('bcrypt');
// bcrypt is used to hash passwords so they are stored safely in the database.

const userModel = require('../models/user');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async function (req, res) {
    try {
        let { displayname, username, password } = req.body;
        let user_already = userModel.findOne({ username: username });
        if (user_already) {
            res.send('User already exists');
        } else {
            // Validate input using Joi
            const userschema = joi.object({
                displayname: joi.string().min(1).required(),
                username: joi.string().min(1).required(),
                password: joi.string().min(8).required()
            })
            const { error } = userschema.validate({ displayname, username, password });
            if (error) {
                res.send('Please fill correctly');
            }
            else {
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                //You're generating a random salt.
                // A salt is just some extra random data added to the password before hashing.
                // This makes the hash unique, even if two users have the same password.
                // The 10 means: "Do 10 rounds of work" (more rounds = more secure but slower).


                const hash = await bcrypt.hash(password, salt);
                // You're mixing the password + salt, and turning them into a hash.
                // This hash looks like a random string (e.g., $2b$10$RabcXYZ...)


                // Create a user
                await userModel.create({ displayname, username, password: hash });
                //After logging in redirect to main page/
                return res.redirect('/');
            }
        }

    } catch (error) {
        console.error(error);
        //If there's an error, redirect to login page laikin koi error dikhana zaroor
        return res.redirect('/');

    }
}

module.exports.loginUser=async function(req,res){
    try {
        let {username,password}=req.body;
        let user1=await userModel.findOne({username:username});
        if(!user1){
            console.log("User not found");
        }
        else{
            bcrypt.compare(password,user1.password,function(err,result){
                if(result){
                    let token=generateToken(user);
                    // 👉 Creates a JWT (JSON Web Token) using the user's info

                    res.cookie("token",token);
                    // “Store this token in a cookie named token.”

                    return res.redirect("/mainpage")
                    // 👉 Redirects to the main page/ after successful login
                }else{
                    console.log("Invalid password");
                    return res.redirect("/");
                }
            })
        }
    } catch (error) {
        
    }
}
