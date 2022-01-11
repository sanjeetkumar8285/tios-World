var express = require('express');
var router = express.Router();
var userModel = require("../models/User");
var ProductlineModel = require("../models/Category")
var Product = require("../models/trialProduct");
const { NotExtended } = require('http-errors');
const auth = require('../middlewares/auth');
const wareHouseModel=require('../models/wareHouse');

router.get('/', async (req, res) =>
{
    res.send("This is seller routes")
})


// adding product by seller
router.post('/product/add', auth.isLoggedIn, async (req, res) =>
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

})

//all product list added by the seller

router.get('/product', auth.isLoggedIn, async (req, res) =>
{
    try
    {

        // const type = req.session.type
        const id = req.user.userID;
        const product = await Product.find({ createdBy: id })

        res.json({ product, sucsess: true })

    } catch (err)
    {
        res.status(400).json({ success: false, err })
    };

})


//edit product by seller

router.put("/product/edit/:id", auth.isLoggedIn, async (req, res) =>
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


//deleting seller product

router.delete("/product/delete/:id", auth.isLoggedIn, async (req, res) =>
{

    try
    {
        const id = req.params.id;

        let data = await Product.deleteOne({ id });

        res.json({ data, success: true })

    } catch (err)
    {
        res.status(400).json({ success: false, err })
    }
})


//wareHoue CRUD

router.post('/wareHouse',auth.isLoggedIn,async(req,res)=>{
try{
const {wareHouseName,contactName,contactNumber,address,pincode,status}=req.body
const wareHouse=new wareHouseModel({
    userId:req.user._id,
    wareHouseName,
    contact_person_name:contactName,
    contact_person_no:contactNumber,
    address,
    pincode,
    status
})
const data=await wareHouse.save();
res.status(201).json({message:"wareHouse created Successfully",success:true,data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message});
}
})

router.get('/wareHouse',auth.isLoggedIn,async(req,res)=>{
try{
    const data=await wareHouseModel.find({}).sort({'createdAt':-1})
    res.status(200).json({message:"all warehouse retrieved",success:true,data})

}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message});
}
})

router.delete('/wareHouse/:id',auth.isLoggedIn,async(req,res)=>{
    try{
const id=req.params.id
const wareHouseData=await wareHouseModel.findById(id);
if(!wareHouseData){
    return res.status(404).json({message:"wareHouse didn't found",success:false})
}
const data=await wareHouseData.remove();
res.status(200).json({message:"wareHouse deleted successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message});
    }
})

router.put('/wareHouse/:id',auth.isLoggedIn,async(req,res)=>{
try{
const id=req.params.id
const {wareHouseName,contactName,contactNumber,address,pincode,status}=req.body
const wareHouseData=await wareHouseModel.findById(id);
if(!wareHouseData){
    return res.status(404).json({message:"wareHouse didn't found",success:false})
}
const data=await wareHouseModel.findByIdAndUpdate(id,{
    wareHouseName,
    contact_person_name:contactName,
    contact_person_no:contactNumber,
    address,
    pincode,
    status
})
res.status(200).json({message:"wareHouse updated Successfully",success:true})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message});
}
})



module.exports = router;