const express=require('express');
const router=express.Router()

const isloggedin = require('../middleware/isloggedIn');

router.get('/logout',isloggedin, (req, res) => {
    res.cookie('token', "");
    return res.send("Logged out");
})

module.exports=router;