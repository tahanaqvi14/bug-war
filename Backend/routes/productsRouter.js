const express = require('express');
const router = express.Router();
const upload = require('../config/multer_config');
const productmodel = require('../models/product');

router.get('/create', function (req, res) {
    res.send('404');
});

router.post('/upload', upload.single('productImage'), async (req, res, next) => {
    try {
        let { productName, productPrice, discountPrice, bgColor, panelColor, textColor } = req.body;
        // Create the product in the database
        let product = await productmodel.create({
            image: req.file.buffer,
            name: productName,
            price: productPrice,
            discount: discountPrice,
            bgcolor:bgColor,
            panelcolor:panelColor,
            textcolor:textColor
        });

        // Set a success flash message
        req.flash('success', "Product created successfully");
        console.log(product)
        // Redirect to the admin page
        res.redirect('/owners/admin');
    } catch (error) {
        console.error(error);
        req.flash('error', "Something went wrong while creating the product");
        res.redirect('/owners/admin');
    }
});

module.exports = router;