var express = require('express');
var router = express.Router();
var userModel = require("../models/User");
var ProductlineModel = require("../models/Category")
var subProductlineModel = require("../models/Subcategory")
var auth = require("../middlewares/auth")
var Product = require("../models/Product");
const { compareSync } = require('bcrypt');
const collectionModel = require('../models/collection');
const sellerModel=require('../models/seller');
const variationModel=require('../models/variations')
const upload=require('../utils/multer')
const fs=require('fs');
const path = require('path');
const bcrypt=require('bcrypt')

const fileHandler=(err,doc)=>{
    if(err){
        console.log('Unlink failed',err)
    }
}

//get all the users by admin

router.get('/user/list', auth.isLoggedIn, async (req, res) =>
{
    try
    {
        const data = await userModel.find();
        res.json({ data });
    } catch (err)
    {
        res.status(400).json({ success: false, err })
    }
});


//adding the user in the list 

router.post("/user/add", auth.isLoggedIn, async (req, res) =>
{
    let data = req.body;
    if (!data.username || !data.password || !data.email)
    {
        return res.status(400).json({
            username: 'username cant be empty',
            email: 'email cant be empty',
            password: 'password cant be empty',
        });
    }
    try
    {
        let user = await userModel.findOne({ username: data.username });

        if (user)
        {
            return res.status(400).json({ username: 'user already exist' });
        }

        let createdUser = await userModel.create(data);

        return res.json({ user: createdUser, message: "User added successfully" });
    } catch (error)
    {
        res.status(400).json({ success: false, error })
    }

})


//updating existuing user 

router.put('/user/edit/:_id', auth.isLoggedIn, async (req, res) =>
{

    let id = req.params._id
    let data = req.body;
    try
    {
        let updatedUser = await userModel.findByIdAndUpdate(id, data);
        res.json({ user: updatedUser, message: "update updated sucessfully" });
    } catch (error)
    {
        res.status(400).json({ success: false, error })
    }
});


//deleting the updated user in the list

router.delete('/user/delete/:id', auth.isLoggedIn, async (req, res) =>
{
    try
    {
        const _id = req.params._id;
        let data = await userModel.deleteOne(_id)

        res.json({ data, message: "user deleted sucessfully" })
    } catch (error)
    {
        res.status(400).json({ success: false, error })
    }
});


// listing all the  product by admin


router.get("/product", auth.isLoggedIn, async (req, res) =>
{
    try
    {

        const product = await Product.find({})
        res.json({ product, success: true })

    } catch (error)
    {
        res.status(400).json({ success: false, err })
    }
})


// post request for adding product

router.post("/product/add", auth.isLoggedIn, async (req, res, next) =>
{
    try
    {

        req.body.createdBy = req.user.userID;

        let subcategory = await subProductlineModel.find({ subcategory_name: req.body.category });

        req.body.subcategory_id = subcategory[0]._id

        const product = await Product.create(req.body);

        res.json({ product, message: "product created sucessfully" })

    } catch (err)
    {
        res.status(400).json({ success: false, err })

    }

});



//post request on product edit form

router.put("/product/edit/:id", async (req, res) =>
{
    try
    {
        const id = req.params.id;

        let subcategory = await subProductlineModel.find({ subcategory_name: req.body.category });

        req.body.subcategory_id = subcategory[0].id;

        let product = await Product.findByIdAndUpdate(id, req.body);

        res.json({ product, message: "product updated Sucessfully" })

    } catch (err)
    {
        res.status(400).json({ success: false, err })
    }

})

// deleteing single product

router.delete("/product/delete/:id", async (req, res) =>
{

    try
    {
        const id = req.params.id;
        let data = await Product.deleteOne({ id });

        res.json({ data, message: "product deleted Sucessfully" })

    } catch (err)
    {
        res.status(400).json({ success: false, err })
    }
})



//getting all the category

router.get("/category", auth.isLoggedIn, async (req, res) =>
{
    try
    {
        const category = await ProductlineModel.find({})
        res.json({ sucess: true, data: category })


    } catch (error)
    {
        res.status(400).json({ success: false, error });
    }
})



//add product line category by admin

router.post("/category/add", auth.isLoggedIn, async (req, res) =>
{
    try
    {
        const category = await ProductlineModel.create(req.body);

        res.json({ category, message: "category added successfully" })
    } catch (error)
    {
        res.status(400).json({ success: false, error });
    }
});

//category deleted by id

router.delete("/category/delete/:id", auth.isLoggedIn, async (req, res) =>
{

    try
    {
        const id = req.params.id;

        let data = await ProductlineModel.deleteOne({ id })

        let subcategory = await subProductlineModel.deleteMany({ category_id: id })

        res.json({ data, message: "category deleted successfully" })


    } catch (error)
    {
        res.status(400).json({ success: false, error });
    }
})




//all sub-catrgory page list
router.get("/subcategory", auth.isLoggedIn, async (req, res) =>
{
    try
    {
        const subcategory = await subProductlineModel.find({})
        res.json({ subcategory, success: true })

    } catch (e)
    {
        res.status(400).json({ success: false, error });
    }
})


// adding sub catgeories by admin

router.post("/subcategory/add", auth.isLoggedIn, async (req, res, next) =>
{

    let body = req.body;

    try
    {
        let category = await ProductlineModel.find({ category_name: req.body.category_name });

        req.body.category_id = category[0]._id;

        const subcategory = await subProductlineModel.create(body);

        let updateCategory = await ProductlineModel.findByIdAndUpdate(category[0]._id, { $push: { subcategories_Id: subcategory._id } })

        res.json({ subcategory, message: "sub category created sucessfully" })

    } catch (error)
    {
        res.status(400).json({ success: false, error });
    }
});



// subcategories delted

router.delete("/subcategory/delete/:id", async (req, res) =>
{
    try
    {
        const id = req.params.id;
        let data = await subProductlineModel.deleteOne({ id })
        res.json({ data, message: "Sub category Deleted Sucessfully " })

    } catch (error)
    {
        res.status(400).json({ success: false, error });
    }
})

router.post('/collection', auth.isLoggedIn,auth.authRole,upload.single('image'),async(req,res)=>{
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
router.get('/collection',auth.isLoggedIn,auth.authRole,async(req,res)=>{
    try{
const data=await collectionModel.find().sort({'createdAt':-1});
res.status(200).json({message:"All collection retreived",success:true,data:data})
    }catch(err){
res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
    }
})

router.delete('/collection/:id',auth.isLoggedIn,auth.authRole,async(req,res)=>{
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

router.put('/collection/:id',auth.isLoggedIn,auth.authRole,upload.single('image'),async(req,res)=>{
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

//save seller  in userModel
const userdata=new userModel({
name,
email,
password:encryptPassword,
role
})
await userdata.save();


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
res.status(200).json({message:"variation added successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.delete('/variation/:id',auth.isLoggedIn,async(req,res)=>{
    try{
        const id=req.params.id;
        const product=await variationModel.findById(id);
        if(!product){
         return res.status(400).json({message:"Product not found",success:false})
        }
     const data=  await product.remove()
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
module.exports = router;