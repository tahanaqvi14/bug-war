import express from 'express';


const router=express.Router()

import {registerUser} from "../controllers/justforfun.js"

router.get('/', function(req, res){
    res.send('404');
});

router.post('/register', registerUser);
// router.post('/login', loginUser);

export default router;

// const express=require('express');
// const router=express.Router()

// const {registerUser, loginUser,logout}=require("../controllers/authController")



// router.get('/', function(req, res){
//     res.send('404');
// });


// router.post('/register', registerUser);
// router.post('/login', loginUser);
// module.exports=router;