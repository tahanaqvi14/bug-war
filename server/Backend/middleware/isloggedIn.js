import jwt from 'jsonwebtoken';
// Imports the jsonwebtoken library to verify tokens.
import userModel from '../models/user.js';
//accessing the user's info from the database



export default async function isloggedin(req) {
//isloggedin is an Express middleware function.
// It runs before protected routes (like dashboard, profile, etc.)
// It checks if the user is logged in by verifying their JWT token.


    if (!req.cookies.token || req.cookies.token === "") {
        // It checks if the user has a token in their cookies OR If there's no token, or it's an empty string, it means the user is not logged in.
        return(false,"You must be logged in");

    } else {
        try {
            let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
            //this verifies the token in the cookies by the secret key in .env file

            //data variable contains all that info which u asked it to save in genratetoken file
            let user = await userModel.findOne({ username: data.username }).select('-password');

            // Find the user in the database using their email from the token, but don’t include the password when getting the user info (for security reasons)
            
            req.user = user;
            // req.user contains all info of the user (fetched from database) which is logged in.
            
            return true;
            // All checks passed — go ahead and run the next middleware or route.


        } catch (error) {
            return false,error, "Something went wrong";
        }
    }
}