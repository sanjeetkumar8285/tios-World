const productFeaturesModel=require('../models/productFeature');
const fs=require('fs');
const path=require('path')


const fileHandler=(err,doc)=>{
    if(err){
        console.log('Unlink failed',err)
    }
}

module.exports.createProductFeature=async(req,res)=>{
    try{
        const name=req.body.name
        console.log(req.file)
        const productFeature=new productFeaturesModel({
            name,
            icon:req.file ? req.file.filename: ''
        })
        const data=await productFeature.save();
    res.status(201).json({message:"productFeature created successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:true,err:err.message})
    }
}

module.exports.getProductFeature=async(req,res)=>{
try{
    const keyword=req.query.keyword
    ? {
        name:{
        $regex:req.query.keyword,
        $options:"i"
        }
    }:{};
const data=await productFeaturesModel.find({...keyword}).sort({'createdAt':-1})
res.status(200).json({message:"All data retrieved",success:true,data})
}
catch(err){
    res.status(400).json({message:"something went wrong",success:false,err:err.message})
}
}

module.exports.deleteProductFeature=async(req,res)=>{
    const id=req.params.id;
    try{
const productFeature=await productFeaturesModel.findById(id)
if(!productFeature){
    return res.status(404).json({message:"productFeature didn't found",success:false})
}
if(productFeature.icon){
    fs.unlink(path.join(__dirname,'../uploads/'+productFeature.icon),fileHandler)
}
const data=await productFeature.remove();
res.status(200).json({message:"productFeature deleted successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"something went wrong",success:false,err:err.message})
    }
}

module.exports.updateProductFeature=async(req,res)=>{
    try{
        const id=req.params.id;
        const name=req.body.name
        const productFeature=await productFeaturesModel.findById(id)
if(!productFeature){
    return res.status(404).json({message:"productFeature didn't found",success:false})
}
if(req.file){
    fs.unlink(path.join(__dirname,'../uploads/'+productFeature.icon),fileHandler)
}
const data=productFeaturesModel.findByIdAndUpdate(id,{
name,
icon:req.file ? req.file.filename : productFeature.icon
})
res.status(200).json({message:"productFeature updated Successfully",status:true})
    }
    catch(err){
        res.status(400).json({message:"something went wrong",success:false,err:err.message})
    }
}