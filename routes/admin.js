var express = require('express');
var router = express.Router();

var auth = require("../middlewares/auth")

const category = require('../controller/category');
const collection = require('../controller/collection')
const customCollection = require('../controller/customCollection');

const variation = require('../controller/variation')
const variationUnit = require('../controller/variationUnit')
const specs = require('../controller/spec');
const specsUnit = require('../controller/specsUnit')
const trialProductsModel = require('../models/trialProduct')
const trialProductController=require('../controller/trialProductController')
const productFeature = require('../controller/productFeature')
const productTagController = require('../controller/productTagController')
const sellerController=require('../controller/sellerController')
const sellerPayoutController=require('../controller/sellerPayoutController');
const upload = require('../utils/multer')
const fs = require('fs');
const path = require('path');



const fileHandler = (err, doc) => {
    if (err) {
        console.log('Unlink failed', err)
    }
}



// category CRUD
router.post('/category', auth.isLoggedIn, upload.single('bannerImage'),category.createCategory)
router.get('/category', auth.isLoggedIn, category.getCategory)
router.delete('/category/:id', auth.isLoggedIn, category.deleteCategory)
router.put('/category/:id', auth.isLoggedIn, upload.single('bannerImage'),category.updateCategory)


//collection CRUD
router.post('/collection', auth.isLoggedIn, upload.single('image'), collection.createCollection)
router.get('/collection', auth.isLoggedIn, collection.getCollection)
router.delete('/collection/:id', auth.isLoggedIn, collection.deleteCollection)
router.put('/collection/:id', auth.isLoggedIn, upload.single('image'), collection.updateCollection)

//customCollection CRUD
router.post('/customCollection', auth.isLoggedIn, customCollection.createCustomCollection)
router.get('/customCollection', auth.isLoggedIn, customCollection.getCustomCollection)
router.delete('/customCollection/:id', auth.isLoggedIn, customCollection.deleteCustomCollection)
router.put('/customCollection/:id', auth.isLoggedIn, customCollection.updateCustomCollection)

//seller CRUD
router.post('/seller', auth.isLoggedIn, upload.fields([
    {
        name: 'logo',
        maxCount: 1
    },
    {
        name: 'coverImage',
        maxCount: 1
    },
    {
        name: 'founderImage1',
        maxCount: 1
    },
    {
        name: 'founderImage2',
        maxCount: 1
    },
    {
        name: 'founderImage3',
        maxCount: 1
    }
]),sellerController.createSeller)

router.delete('/seller/:id', auth.isLoggedIn, sellerController.deleteSeller)
router.get('/seller', auth.isLoggedIn, sellerController.getSeller)
router.put('/seller/:id', auth.isLoggedIn, upload.fields([
    {
        name: 'logo',
        maxCount: 1
    },
    {
        name: 'coverImage',
        maxCount: 1
    },
    {
        name: 'founderImage1',
        maxCount: 1
    },
    {
        name: 'founderImage2',
        maxCount: 1
    },
    {
        name: 'founderImage3',
        maxCount: 1
    }
]),sellerController.updateSeller )

// variation CRUD
router.post('/variation', auth.isLoggedIn, variation.createVariation)
router.get('/variation', auth.isLoggedIn, variation.getVariation)
router.delete('/variation/:id', auth.isLoggedIn, variation.deleteVariation)
router.put('/variation/:id', auth.isLoggedIn, variation.updateVariation)

// variations unit crud

router.post('/variationUnit', auth.isLoggedIn, variationUnit.createVariationUnit)
router.get('/variationUnit', auth.isLoggedIn, variationUnit.getVariationUnit)
router.delete('/variationUnit/:id', auth.isLoggedIn, variationUnit.deleteVariationUnit)
router.put('/variationUnit/:id', auth.isLoggedIn, variationUnit.updateVariationUnit)

// Specs CRUD
router.post('/specs', auth.isLoggedIn, specs.createSpecs)
router.get('/specs', auth.isLoggedIn, specs.getSpecs)
router.delete('/specs/:id', auth.isLoggedIn, specs.deleteSpecs)
router.put('/specs/:id', auth.isLoggedIn, specs.updateSpecs)

//specsUnit crud
router.post('/specsUnit', auth.isLoggedIn, specsUnit.createSpecsUnit)
router.get('/specsUnit', auth.isLoggedIn, specsUnit.getSpecsUnit)
router.delete('/specsUnit/:id', auth.isLoggedIn, specsUnit.deleteSpecsUnit)
router.put('/specsUnit/:id', auth.isLoggedIn, specsUnit.updateSpecsUnit)

// productFeature CRUD
router.post('/productFeature', auth.isLoggedIn, upload.single('icon'), productFeature.createProductFeature)
router.get('/productFeature', auth.isLoggedIn, productFeature.getProductFeature)
router.delete('/productFeature/:id', auth.isLoggedIn, productFeature.deleteProductFeature)
router.put('/productFeature/:id', auth.isLoggedIn, upload.single('icon'), productFeature.updateProductFeature)

//productTag crud
router.post('/productTag', auth.isLoggedIn, productTagController.createProductTag)
router.get('/productTag', auth.isLoggedIn, productTagController.getProductTag)
router.delete('/productTag/:id', auth.isLoggedIn, productTagController.deleteProductTag)
router.put('/productTag/:id', auth.isLoggedIn, productTagController.updateProductTag)

//sellerpayout crud
router.post('/sellerPayout',auth.isLoggedIn,sellerPayoutController.createSellerPayout);
router.get('/sellerPayout',auth.isLoggedIn,sellerPayoutController.getSellerPayout);
router.delete('/sellerPayout/:id',auth.isLoggedIn,sellerPayoutController.deleteSellerPayout);
router.put('/sellerPayout/:id',auth.isLoggedIn,sellerPayoutController.updateSellerPayout);

//trailProduct CRUD API    
router.post('/trialProducts', auth.isLoggedIn, upload.fields([
{
    name: 'mapImage',
    maxCount: 1
},
{
    name: 'frontImage',
    maxCount: 1
},
{
    name: 'backImage',
    maxCount: 1
},
{
    name: 'galleryImages',
    maxCount: 10
},
{
    name: 'processImage',
    maxCount: 5
}
]),trialProductController.createTrialProduct )



router.get('/trialProducts', auth.isLoggedIn, trialProductController.getTrialProduct)

router.delete('/trialProducts/:id', auth.isLoggedIn, )

router.put('/trialProducts/:id', auth.isLoggedIn, upload.fields([{
    name: 'mapImage',
    maxCount: 1
}, 
{
    name: 'frontImage',
    maxCount: 1
},
{
    name: 'backImage',
    maxCount: 1
},
{
    name: 'galleryImage',
    maxCount: 10
}, {
    name: 'processImage',
    maxCount: 5
}]), trialProductController.updateTrialProduct)




module.exports = router;