const express=require('express');
const router=express.Router();
const orderModel=require('../models/orderModel');
const auth=require('../middlewares/auth')
router.post('/order',auth.isLoggedIn,async(req,res)=>{
    try{
        const {shippingInfo,orderItems,paymentInfo,itemPrice,shippingPrice,taxPrice,totalPrice
            }=req.body
const orderData=new orderModel({
    userId:req.user._id,
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    shippingPrice,
    taxPrice,
    totalPrice
})
const data=await orderData.save();
res.status(201).json({message:"Order created Successfully",success:true,data})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:true,err:err.message})
    }

})
 // get logged in user  Orders
router.get('/myOrder',auth.isLoggedIn,async(req,res)=>{
try{
const data=await orderModel.find({userId:req.user._id}).sort({'createdAt':-1})
res.status(200).json({message:"My orders retrieved",success:true,data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
})

//get All orders for admin
router.get('/allOrders',auth.isLoggedIn,async(req,res)=>{
    try{
        const orders=await orderModel.find().sort({'createdAt':-1})
        let totalAmount=0;
        orders.forEach((order)=>{
            totalAmount+=order.totalPrice
        })
        res.status(200).json({message:"all orders retrieved",success:true,totalAmount,data:orders})
        }catch(err){
            res.status(400).json({message:"Something went wrong",success:false,err:err.message})
        }
})

// get a specific order details
router.get('/order/:id',async(req,res)=>{
try{
const id=req.params.id;
const data=await orderModel.findById(id).populate("userId","name email");
res.status(200).json({message:"specific order details",success:true,data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
})

router.delete('/order/:id',auth.isLoggedIn,async(req,res)=>{
    try{
const id=req.params.id;
const order=await orderModel.findById(id)
if(!order){
    return res.status(404).json({message:"Order with this Id doesn't exist",success:false})
}
const data=await order.remove();
res.status(200).json({message:"Order deleted successfully",success:true,data})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
})
module.exports=router

