const jwt=require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign({ email:user.email,userid: user._id }, process.env.JWT_KEY);

}
module.exports.generateToken=generateToken 