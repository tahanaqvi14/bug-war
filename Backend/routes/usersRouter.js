import express from 'express';


const router=express.Router()

// import {registerUser} from "../controllers/justforfun.js"
import {registerUser,loginUser} from "../controllers/authorizationControl.js"

router.get('/', function(req, res){
    res.send('404');
});

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;