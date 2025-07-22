const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

async function isloggedin(req, res, next) {
    if (!req.cookies.token || req.cookies.token === "") {
        req.flash('error', "You must be logged in");
        return res.redirect("/");
    } else {
        try {
            let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
            let user = await userModel.findOne({ email: data.email }).select('-password');
            req.user = user;
            next();
        } catch (error) {
            req.flash('error', "Something went wrong");
            res.redirect('/');
        }
    }
}

module.exports = isloggedin;
