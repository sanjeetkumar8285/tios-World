var express = require('express');
var router = express.Router();
const { NotExtended } = require('http-errors');
const auth = require('../middlewares/auth');
const wareHouseModel=require('../models/wareHouse');
const wareHouse=require('../controller/seller/wareHouse');
const productModel=require('../models/product');
const productvariationModel=require('../models/variationProduct')
const categoryModel=require('../models/Category');
const upload = require('../utils/multer');
const fs=require('fs');
const path=require('path');
const fileHandler=(err,doc)=>{
    if(err){
        console.log("Unlink failed",err)
    }
}



//seller Product

router.post('/product',auth.isLoggedIn,upload.fields([{
    name:'mapImage',
    maxCount:1
},
{
name:'frontImage',
maxCount:1
},
{
    name:'backImage',
    maxCount:1
},
    {
        name:'galleryImage',
        maxCount:10
    },
    {
        name:'processImage',
        maxCount:10
    }
]),async(req,res)=>{
try{
const {categoryName,productName,wareHouseName,productFeatures,productConsumptionTime,ratingNumber,ratingStar,
purchasePrice,sellingPrice,discountPercentage,savingPrice,taxType,taxPercentage,specsName,specsUnit,weight,
dimension,stock,origin,originType,certification,skuNumber,tiosNumber,is_variation,
processDescription,status,isReturnable
}=req.body


const category=await categoryModel.findOne({categoryName});
const wareHouse=await wareHouseModel.findOne({wareHouseName})
let galleryImage;
if(req.files.galleryImage){
galleryImage=req.files.galleryImage.map((data)=>{
    return data.filename
})
}
else{
galleryImage=[]
}

let processImage;
if(req.files.processImage){
    processImage=req.files.processImage.map((data)=>{
        return data.filename
    })
    }
else{
    processImage=[]
}
let data;

if(is_variation=='false'){

    const product=new productModel({
userId:req.user._id,
category:{
    categoryName,
    categoryId:category._id
},
productName,
wareHouse:{
    wareHouseName,
    wareHouseId:wareHouse._id
},
productFeatures,
productConsumptionTime,
taxes:{
    taxType,
    taxPercentage,
},
rating:{
    number:ratingNumber,
    star:ratingStar
},
price:{
    purchasePrice,
    sellingPrice,
    discountPercentage,
    savingPrice,
},
specs:{
    specsName,
    specsUnit,
    weight,
    dimension
},
stock,
originDetails:{
    origin,
    type: originType,
    certification,
    mapImage:req.files.mapImage ? req.files.mapImage[0].filename :''
},
productIdentification:{
skuNumber,
tiosNumber
},
productImage:{
    frontImage:req.files.frontImage ? req.files.frontImage[0].filename:'',
    backImage:req.files.backImage ? req.files.backImage[0].filename:'',
    galleryImages:galleryImage
},
processDetails:{
    processDescription,
    processDescription1:req.body.processDescription1,
    processDescription2:req.body.processDescription2,
    processDescription3:req.body.processDescription3,
    processDescription4:req.body.processDescription4,
    processImage:processImage
},
status,
is_variation,
isReturnable
    })

 data=await product.save();
}
else{
 
    const product=new productModel({
        userId:req.user._id,
category:{
    categoryName,
    categoryId:category._id
},
productName,
wareHouse:{
    wareHouseName,
    wareHouseId:wareHouse._id
},
productFeatures,
productConsumptionTime,
taxes:{
    taxType,
    taxPercentage,
},
rating:{
    number:ratingNumber,
    star:ratingStar
},
originDetails:{
    origin,
    type: originType,
    certification,
    mapImage:req.files.mapImage ? req.files.mapImage[0].filename :''
},
processDetails:{
    processDescription,
    processDescription1:req.body.processDescription1,
    processDescription2:req.body.processDescription2,
    processDescription3:req.body.processDescription3,
    processDescription4:req.body.processDescription4,
    processImage:processImage
},
status,
is_variation,
isReturnable
    })
    data=await product.save();

    const productVariation=new productvariationModel({
        productId:data._id,
        size:req.body.size,
        color:req.body.color,
        weight:req.body.weight,
        purchasePrice,
        sellingPrice,
        discountPercentage,
        savingPrice,
        stock,
        frontImage:req.files.frontImage ? req.files.frontImage[0].filename:'',
        backImage:req.files.backImage ? req.files.backImage[0].filename:'',
        galleryImages:galleryImage,
        dimension,
        specs:specsName,
        specsUnit,
        weight1:weight,
        skuNumber,
        tiosNumber
    })
    await productVariation.save();
}

res.status(200).json({message:"product created successfully",success:true,data})
}catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
})

router.get('/product',auth.isLoggedIn,async(req,res)=>{
try{
const data=await productModel.find({}).sort({'createdAt':-1})
res.status(200).json({message:"All product retreived",success:true,data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
})

router.delete('/product/:id',auth.isLoggedIn,async(req,res)=>{
    try{
        const id=req.params.id
        const product=await productModel.findById(id)
        if(!product){
            return res.status(404).json({message:"product didn't found",success:false})
        }
        let data;
        if(product.processDetails.processImage){
            product.processDetails.processImage.map((data)=>{
                fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler)
            })
        }
        if(product.originDetails.mapImage){
            fs.unlink(path.join(__dirname,'../uploads/'+product.originDetails.mapImage),fileHandler)
        }

        if(!product.is_variation){
           
            if(product.productImage.frontImage){
                fs.unlink(path.join(__dirname,'../uploads/'+product.productImage.frontImage),fileHandler)
            }
            if(product.productImage.backImage){
                fs.unlink(path.join(__dirname,'../uploads/'+product.productImage.backImage),fileHandler)
            }
            if(product.productImage.galleryImages){
                product.productImage.galleryImages.map((data)=>{
                fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler)
                })
            }
           
         data=   await product.remove();
        }
        else{
      const variationData=await productvariationModel.findOne({productId:id})
      console.log(variationData);
if(variationData.frontImage){
    fs.unlink(path.join(__dirname,'../uploads/'+variationData.frontImage),fileHandler)
}
if(variationData.backImage){
    fs.unlink(path.join(__dirname,'../uploads/'+variationData.backImage),fileHandler)
}
if(variationData.galleryImages){
    variationData.galleryImages.map((data)=>{
        fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler)
    })
}
data=await product.remove();
await variationData.remove();
 
}

res.status(200).json({message:"product deleted successfully",success:true,data})
    }catch(err){
        console.log(err)
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
})

//wareHoue CRUD

router.post('/wareHouse',auth.isLoggedIn,wareHouse.createWareHouse)
router.get('/wareHouse',auth.isLoggedIn,wareHouse.getWareHouse)
router.delete('/wareHouse/:id',auth.isLoggedIn,wareHouse.deleteWareHouse)
router.put('/wareHouse/:id',auth.isLoggedIn,wareHouse.updateWareHouse)



module.exports = router;