var express = require('express');
var router = express.Router();
var userModel = require("../models/User");
var auth = require("../middlewares/auth")
const categoryModel=require('../models/Category');
const collectionModel = require('../models/collection');
const customCollectionModel=require('../models/customCollection');
const sellerModel=require('../models/seller');
const variationModel=require('../models/variations')
const variationUnitModel=require('../models/variationsUnit');
const specsModel=require('../models/specs');
const specsUnitModel=require('../models/specsUnit');
const trialProductsModel=require('../models/trialProduct')
const upload=require('../utils/multer')
const fs=require('fs');
const path = require('path');
const bcrypt=require('bcrypt');


const fileHandler=(err,doc)=>{
    if(err){
        console.log('Unlink failed',err)
    }
}
function slugify(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }




router.post('/category',auth.isLoggedIn,async(req,res)=>{
    try{
        const {categoryName,parentCategory}=req.body
        let parent;
        if(parentCategory){
         parent=await categoryModel.findOne({categoryName:parentCategory})
        }
        let category
   if(parent){
    category=new categoryModel({
        userId:req.user._id,
        categoryName,
        parent_Id:parent._id ? parent._id :null
    })
   }else{
    category=new categoryModel({
        userId:req.user._id,
        categoryName
    })
   }
        const data=await category.save();
        res.status(201).json({message:"catgory added successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:true,err:err.message})
    }
})

router.get('/category',auth.isLoggedIn,async(req,res)=>{
    try{
        const data=await categoryModel.find({})
        res.status(200).json({message:"all category retrieved",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
})

router.delete('/category/:id',auth.isLoggedIn,async(req,res)=>{
try{
const id=req.params.id
const category=await categoryModel.findById(id);
if(!category){
    return res.status(404).json({message:"category doesn't exist",success:false})
}
const data=await category.remove();
res.status(400).json({message:"category deleted successfully",success:true,data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
})

router.put('/category/:id',auth.isLoggedIn,async(req,res)=>{
try{
const id=req.params.id
const {categoryName,parentCategory}=req.body
const categoryExist=await categoryModel.findById(id);
if(!categoryExist){
    return res.status(404).json({message:"category doesn't exist",success:false})
}
let parent;
if(parentCategory){
    parent=await categoryModel.findOne({categoryName:parentCategory})
   }
   let category
if(parent){
category={
   categoryName,
   parent_Id:parent._id ? parent._id :null,
}
}else{
category={
   categoryName,
}
}
const data=await categoryModel.findByIdAndUpdate(id,{$set:{...category,"slug":slugify(categoryName)}})
res.status(200).json({message:"category uploaded successfully",success:true})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
})

//collection CRUD
router.post('/collection', auth.isLoggedIn,upload.single('image'),async(req,res)=>{
    const {name,slug,products,regularDetails,organicSubCategoryDetails,status}=req.body
    if( !name || !slug || !products || !regularDetails || !organicSubCategoryDetails || !status || !req.file){
        return res.status(400).json({message:"All fields are required",success:false})
    }
    // console.log(req.file)
    // console.log(req.user)
    try{
    const collection=new collectionModel({
        userId:req.user._id,
        name,
        slug,
        products,
        regularDetails,
        organicSubCategoryDetails,
        status,
        image:req.file ? req.file.filename : ''
    })
    const data=await collection.save();
    res.status(200).json({message:"Collection created Successfully",success:true,data:data})
}catch(err){
    console.log(err)
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
})

//get All the collection
router.get('/collection',auth.isLoggedIn,async(req,res)=>{
    try{
const data=await collectionModel.find().sort({'createdAt':-1});
res.status(200).json({message:"All collection retreived",success:true,data:data})
    }catch(err){
res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
    }
})

router.delete('/collection/:id',auth.isLoggedIn,async(req,res)=>{
    try{
        const id=req.params.id;
        const data=await collectionModel.findById(id)
        if(!data){
         return res.status(200).json({message:"collection does not exist",success:false})
        }
        else{
            fs.unlink(path.join(__dirname,'../uploads/'+data.image),fileHandler);
            await data.remove();
            res.status(200).json({message:"collection deleted Successfully",success:true,data:data})
        }
            }catch(err){
            res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
        }
})

router.put('/collection/:id',auth.isLoggedIn,upload.single('image'),async(req,res)=>{
    try{
const id=req.params.id;
const {name,slug,products,regularDetails,organicSubCategoryDetails,status}=req.body
const data={
    userId:req.user._id,
    name,
    slug,
    products,
    regularDetails,
    organicSubCategoryDetails,
    status,
    image:req.file.filename
}
const collection=await collectionModel.findById(id)
if(req.file){
    fs.unlink(path.join(__dirname,'../uploads/'+collection.image),fileHandler);
}
  const col=  await collectionModel.findByIdAndUpdate(id,data,{
        new: true
        })
res.status(200).json({message:"collection updated Successfully",success:true,data:col})
    }catch(err){
        res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
    }
})

//customCollection CRUD
router.post('/customCollection',auth.isLoggedIn,async(req,res)=>{
    try{
        const {collectionName,slug,curatedType,curatedName,trialType,trialName,sponsoredType,sponsoredName,status}=req.body
        const customCollection=new customCollectionModel({
            userId:req.user._id,
            collectionName,
            slug,
            curratedProducts:{
                productType:curatedType,
                productName:curatedName
            },
            trialProduct:{
                productType:trialType,
                productName:trialName,
            },
            sponsoredProduct:{
                productType:sponsoredType,
                productName:sponsoredName,
            },
            status
        })
        const data=await customCollection.save();
        res.status(201).json({message:"custom collection created Successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
    }
})
//seller CRUD

router.post('/seller',auth.isLoggedIn,upload.fields([{
    name:'logo',
    maxCount:1
},{
name:'images',
maxCount:4
}]),async(req,res)=>{

    try{
const {name,email,password,phone,businessTitle,tagline,aboutBusiness,aboutFounder,role,status}=req.body

let imageArray;
if(req.files.images){
     imageArray=req.files.images.map((data)=>{
        return data.filename
    })
}
else{
    imageArray=[];
}

const encryptPassword=await bcrypt.hash(password,10)



const seller=new sellerModel({
userId:req.user._id,    
name,
email,
password:encryptPassword,
phone,
businessTitle,
tagline:tagline,
aboutBusiness,
aboutFounder,
role,
status,
logo:req.files.logo ? req.files.logo[0].filename : '',
images:imageArray
})
const data=await seller.save();
//save seller  in userModel
const userdata=new userModel({
    name,
    email,
    password:encryptPassword,
    role
    })
    await userdata.save();
res.status(201).json({message:"Seller addded successfully",success:true,data:data})
    }catch(err){
        console.log(err)
res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
})


router.delete('/seller/:id',auth.isLoggedIn,async(req,res)=>{
try{
const id=req.params.id;
const seller=await sellerModel.findById(id)
if(seller.logo){
    fs.unlink(path.join(__dirname,'../uploads/'+seller.logo),fileHandler)
}
if(seller.images){
    seller.images.map((data)=>{
        fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler)
    })
}
const userData=await userModel.findOne({email:seller.email})
if(userData){
    await userData.remove();
}
const data=await seller.remove();
res.status(200).json({message:"seller deleted successfully",success:true,data:data})
}catch(err){
    console.log(err)
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
})

router.get('/seller',auth.isLoggedIn,async(req,res)=>{
    try{
        const data=await sellerModel.find({}).sort({'createdAt':-1})
        res.status(200).json({message:"All seller retreived",success:true,data:data})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
})

router.put('/seller/:id',auth.isLoggedIn,upload.fields([{
    name:'logo',
    maxCount:1
},{
name:'images',
maxCount:4
}]),async(req,res)=>{
    try{
        const id=req.params.id;
        const {name,businessTitle,tagline,aboutBusiness,aboutFounder,role,status}=req.body
        const seller=await sellerModel.findById(id);
        if(req.files.logo ){
            fs.unlink(path.join(__dirname,'../uploads/'+seller.logo),fileHandler)
        }
        if(req.files.images){
            seller.images.map((data)=>{
                fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler)
            })
        }
        let imageArray;
if(req.files.images){
     imageArray=req.files.images.map((data)=>{
        return data.filename
    })
}
        const data=await sellerModel.findByIdAndUpdate(id,{
            name,
            businessTitle,
            tagline:tagline,
            aboutBusiness,
            aboutFounder,
            role,
            logo:req.files.logo ? req.files.logo[0].filename : seller.logo,
            images:imageArray,
            status
        })
res.status(200).json({message:'seller updated successfully',success:true,data:data})
    }catch(err){
        console.log(err);
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

// variation CRUD
router.post('/variation',auth.isLoggedIn,async(req,res)=>{
    try{
const {variationName,status}=req.body
const variation=new variationModel({
    userId:req.user._id,
    variationName,
    status
})
const data=await variation.save();
res.status(201).json({message:"variation added successfully",success:true,data:data})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/variation',auth.isLoggedIn,async(req,res)=>{
    try{
const data=await variationModel.find({}).sort({'createdAt':-1});
res.status(200).json({message:"All variation retreived",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.delete('/variation/:id',auth.isLoggedIn,async(req,res)=>{
    try{
        const id=req.params.id;
        const variations=await variationModel.findById(id);
        if(!variations){
         return res.status(404).json({message:"variations not found",success:false})
        }
     const data=  await variations.remove()
        res.status(200).json({message:"variation deleted successfully",success:true,data})
            }catch(err){
                res.status(400).json({message:"Something went wrong",success:false,err:err})
            }
})

router.put('/variation/:id',auth.isLoggedIn,async(req,res)=>{
    try{
        const id=req.params.id;
        const {variationName,status}=req.body
        const data=await variationModel.findByIdAndUpdate(id,{
            variationName,status
        })
        res.status(200).json({message:"variation updated successfully",success:true,data}) 
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})



// variations unit crud

router.post('/variationUnit',auth.isLoggedIn,async(req,res)=>{
try{
    const {variationName,unitName,status}=req.body
    const variationData=await variationModel.findOne({variationName})
    const variations=new variationUnitModel({
        variationId:variationData._id,
        variationName,
        unitName,
        status
    })
    const data=await variations.save();
    res.status(201).json({message:"variation unit created Successfully",success:true,data:data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err})
}
})

router.get('/variationUnit',auth.isLoggedIn,async(req,res)=>{
try{
const data=await variationUnitModel.find({}).sort({'createdAt':-1})
res.status(200).json({message:'All variation Units retreived',success:true,data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err})
}
})

router.delete('/variationUnit/:id',auth.isLoggedIn,async(req,res)=>{
    try{
      const id=req.params.id
        const variation=await variationUnitModel.findById(id)
        if(!variation){
            return res.status(404).json({message:"variation Unit doesn't exist",success:false})
        }
        const data=await variation.remove();
        res.status(200).json({message:"variation Unit deleted Successfully",success:true,data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.put('/variationUnit/:id',auth.isLoggedIn,async(req,res)=>{
try{
const id=req.params.id
const {variationName,unitName,status}=req.body
const variations=await variationUnitModel.findById(id)
if(!variations){
    return res.status(404).json({message:"Variation unit doesn't exist",success:false})
}
const data=await variationUnitModel.findByIdAndUpdate(id,{
    variationName,unitName,status
})
res.status(200).json({message:"variationUnit updated Successfully",success:true})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err})
}
})

// Specs CRUD
router.post('/specs',auth.isLoggedIn,async(req,res)=>{
    try{
const {specsName,status}=req.body
const specs=new specsModel({
    userId:req.user._id,
    specsName,
    status
})
const data=await specs.save();
res.status(201).json({message:"specs added successfully",success:true,data:data})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/specs',auth.isLoggedIn,async(req,res)=>{
    try{
const data=await specsModel.find({}).sort({'createdAt':-1});
res.status(200).json({message:"All specs retreived",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.delete('/specs/:id',auth.isLoggedIn,async(req,res)=>{
    try{
        const id=req.params.id;
        const specs=await specsModel.findById(id);
        if(!specs){
         return res.status(404).json({message:"specs not found",success:false})
        }
     const data=  await specs.remove()
        res.status(200).json({message:"specs deleted successfully",success:true,data})
            }catch(err){
                res.status(400).json({message:"Something went wrong",success:false,err:err})
            }
})

router.put('/specs/:id',auth.isLoggedIn,async(req,res)=>{
    try{
        const id=req.params.id;
        const {specsName,status}=req.body
        const data=await specsModel.findByIdAndUpdate(id,{
            specsName,status
        })
        res.status(200).json({message:"specs updated successfully",success:true}) 
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


//specsUnit crud
router.post('/specsUnit',auth.isLoggedIn,async(req,res)=>{
    try{
        const {specsName,unitName,status}=req.body
        const specsData=await specsModel.findOne({specsName})
        const specss=new specsUnitModel({
            specsName,
            specsId:specsData._id,
            unitName,
            status
        })
        const data=await specss.save();
        res.status(201).json({message:"specs unit created Successfully",success:true,data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
    })
    
    router.get('/specsUnit',auth.isLoggedIn,async(req,res)=>{
    try{
    const data=await specsUnitModel.find({}).sort({'createdAt':-1})
    res.status(200).json({message:'All specs Units retreived',success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
    })
    
    router.delete('/specsUnit/:id',auth.isLoggedIn,async(req,res)=>{
        try{
          const id=req.params.id
            const specs=await specsUnitModel.findById(id)
            if(!specs){
                return res.status(404).json({message:"specs Unit doesn't exist",success:false})
            }
            const data=await specs.remove();
            res.status(200).json({message:"specs Unit deleted Successfully",success:true,data:data})
        }catch(err){
            res.status(400).json({message:"Something went wrong",success:false,err:err})
        }
    })
    
    router.put('/specsUnit/:id',auth.isLoggedIn,async(req,res)=>{
    try{
    const id=req.params.id
    const {specsName,unitName,status}=req.body
    const specs=await specsUnitModel.findById(id)
    if(!specs){
        return res.status(404).json({message:"specs unit doesn't exist",success:false})
    }
    const data=await specsUnitModel.findByIdAndUpdate(id,{
        specsName,unitName,status
    })
    res.status(200).json({message:"specsUnit updated Successfully",success:true})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
    })
    
router.post('/trialProducts',auth.isLoggedIn,upload.fields([{
    name:'mapImage',
    maxCount:1
},
{
    name:'productImage',
    maxCount:6
},
{
    name:'processImage',
    maxCount:5
}
]),async(req,res)=>{
try{
const {product,tiosPoint,category,productName,ratingNumber,ratingStar,purchasePrice,sellingPrice,
discountPercentage,savingPrice,taxType,taxPercentage,taxPrice,specsName,specsUnit,weight,color,size,
stock,origin,originType,certification,productIdentificationType,productIdentificationNumber,processShortDetail,
processDescription,status
}=req.body


let productImage;
if(req.files.productImage){
productImage=req.files.productImage.map((data)=>{
    return data.filename
})
}
else{
productImage=[]
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

const trialProduct=new trialProductsModel({
    userID:req.user._id,
    product,
    tiosPoint,
    category,
    productName,
    rating:{
       number:ratingNumber,
       star:ratingStar
    },price:{
        purchasePrice,
        sellingPrice,
        discountPercentage,
        savingPrice,
        taxType,
        taxPercentage,
        taxPrice
    },
    specsAndVariation:{
        specsName,
        specsUnit,
        weight,
        color,
        size
    },
    stock,
    originDetails:{
        origin,
        originType,
        certification,
        mapImage:req.files.mapImage ? req.files.mapImage[0].filename :''
    },
    productIdentification:{
type:productIdentificationType,
number:productIdentificationNumber
    },
    productImage:productImage,
    processDetails:{
        processShortDetail,
        processDescription,
        processImage:processImage
    },
    status
})
const data=await trialProduct.save();
res.status(201).json({message:"Trial product added Successfuly",success:false,data:data})
}catch(err){
    res.status(400).json({message:"Something Went wrong",success:false,err:err.message})
}
})



router.get('/trialProducts',auth.isLoggedIn,async(req,res)=>{
    try{
const data=await trialProductsModel.find({}).sort({'createdAt':-1});
res.status(200).json({message:"All trial Product retreived",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something Went wrong",success:false,err:err.message})
    }
})

router.delete('/trialProducts/:id',auth.isLoggedIn,async(req,res)=>{
try{
 const id=req.params.id;
 console.log(id)
    const trialProduct=await trialProductsModel.findById(id)
    if(!trialProduct){
       return res.status(404).json({message:"product not found",message:false});
    }
if(trialProduct.originDetails.mapImage){
    fs.unlink(path.join(__dirname,'../uploads/'+trialProduct.originDetails.mapImage),fileHandler);
}
if(trialProduct.productImage){
    trialProduct.productImage.map((data)=>{
        fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler);
    })
}
if(trialProduct.processDetails.processImage){
    trialProduct.processDetails.processImage.map((data)=>{
        fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler);
    })
}
const data=await trialProduct.remove();
res.status(200).json({message:"product deleted successfully",success:true,data});
}catch(err){
    res.status(400).json({message:"Something Went wrong",success:false,err:err.message})
}
})

router.put('/trialProducts/:id',auth.isLoggedIn,upload.fields([{
name:'mapImage',
maxCount:1
},{
name:'productImage',
maxCount:1
},{
name:'processImage',
maxCount:1
}]),async(req,res)=>{
try{
    const {product,tiosPoint,category,productName,ratingNumber,ratingStar,purchasePrice,sellingPrice,
        discountPercentage,savingPrice,taxType,taxPercentage,taxPrice,specsName,specsUnit,weight,color,size,
        stock,origin,originType,certification,productIdentificationType,productIdentificationNumber,processShortDetail,
        processDescription,status
        }=req.body
      const id=req.params.id;
       const trialProduct=await trialProductsModel.findById(id)
       if(!trialProduct) {
           return res.status(404).json({message:"product not found",success:false})
       }
       if(req.files.mapImage){
           fs.unlink(path.join(__dirname,'../uploads/'+trialProduct.originDetails.mapImage),fileHandler)
       }
       if(req.files.productImage){
           trialProduct.productImage.map((data)=>{
        fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler);
    })
       }
       if(req.files.processImage){
            trialProduct.processDetails.processImage.map((data)=>{
        fs.unlink(path.join(__dirname,'../uploads/'+data),fileHandler);
    })
       }
  
       let productImage;
if(req.files.productImage){
productImage=req.files.productImage.map((data)=>{
    return data.filename
})
}


let processImage;
if(req.files.processImage){
    processImage=req.files.processImage.map((data)=>{
        return data.filename
    })
    }


const data=await trialProductsModel.findByIdAndUpdate(id,{
    product,
    tiosPoint,
    category,
    productName,
    "rating.number":ratingNumber,
    "rating.star":ratingStar,
     "price.purchasePrice":purchasePrice,
    "price.sellingPrice":sellingPrice,
    "price.discountPercentage":discountPercentage,
    "price.savingPrice":savingPrice,
    "price.taxType":taxType,
    "price.taxPercentage":taxPercentage,
    "price.taxPrice":taxPrice,

    "specsAndVariation.specsName":specsName,
    "specsAndVariation.specsUnit":specsUnit,
    "specsAndVariation.weight":weight,
    "specsAndVariation.color":color,
    "specsAndVariation.size":size,

    stock,

    "originDetails.origin":origin,
    "originDetails.originType":originType,
    "originDetails.certification":certification,
    "originDetails.mapImage":req.files.mapImage ? req.files.mapImage[0].filename :trialProduct.originDetails.mapImage,
  
    "productIdentification.type":productIdentificationType,
    "productIdentification.number":productIdentificationNumber,

    productImage:productImage,

    "processDetails.processShortDetail":processShortDetail,
    "processDetails.processDescription":processDescription,
    "processDetails.processImage":processImage,

    status
})
res.status(200).json({message:"Trial product updated Successfully",success:true})
}catch(err){
    res.status(400).json({message:"Something Went wrong",success:false,err:err.message})
}
})
module.exports = router;