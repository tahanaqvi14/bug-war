const express = require('express');
const router = express.Router();
const isloggedin = require('../middleware/isloggedIn');
const productModel = require('../models/product');
const userModel = require('../models/user');

router.get('/', function (req, res) {
    let error = req.flash('error');
    let success = req.flash('success');
    res.render('index', { error, success, loggedin: false });
});

router.get('/shop', isloggedin, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash('success');
    res.render('shop', { products, success });
});

router.get('/addtocart/:id', isloggedin, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        user.cart.push(req.params.id);
        await user.save();
        req.flash('success', 'Product added to cart!');
        res.redirect('/shop');
    } catch (error) {

        req.flash('error', 'Something went wrong');
        res.redirect('/shop');
    }
});

router.get('/cart', isloggedin, async function (req, res) {
    const user=await userModel.findOne({email:req.user.email}).populate('cart');
    res.render('cart',{user})
});

router.get('/logout',isloggedin, (req, res) => {
    res.cookie('token', "");
    res.redirect('/');
})

router.get('/removefromcart/:id',isloggedin, async (req, res) => {
    await userModel.updateOne(
        { email: req.user.email },
        { $pull: { cart: req.params.id } })
        res.redirect('/cart')
})

module.exports = router;