import express from 'express';
const router=express.Router()

// import {registerUser} from "../controllers/justforfun.js"
import {registerUser,loginUser} from "../controllers/authorizationControl.js"
import {board} from "../controllers/leaderboard.js"
import {profileinfo} from "../controllers/profileinfo.js"

router.get('/', function(req, res){
    res.send('404');
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/board',board)
router.get('/profile',profileinfo)

export default router;