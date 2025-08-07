
const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner');

router.get('/admin', function (req, res) {
    let success = req.flash('success');
    res.render('createproducts',{success})
});

console.log(process.env.NODE_ENV);

// create owner only in development mode, in production mode we should not allow
//  this route to be accessed by anyone other than admin
if (process.env.NODE_ENV === 'development') {
    router.post('/create', async function (req, res) {
        let owner = await ownerModel.find();
        if (owner.length > 0) {
            return res.status(503).send("you don't have permission to create");
        } else {
            let { fullname, email, password } = req.body;
            let createdowner = await ownerModel.create({
                fullname,
                email,
                password,
            });
            res.status(200).send(createdowner);
        }
    });
}

module.exports = router;
