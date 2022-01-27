const collectionModel=require('../models/collection');
const categoryModel=require('../models/Category');
const fs=require('fs')
const path=require('path')
const slugify=require('../utils/slugify');

const fileHandler=(err,doc)=>{
    if(err){
        console.log('Unlink failed',err)
    }
}

module.exports.createCollection=async(req,res)=>{
    const {collectionName,slug,categoryName,productType,products,status}=req.body
 
    const category=await categoryModel.findOne({categoryName})
    console.log(category)
    try{
    const collection=new collectionModel({
        userId:req.user._id,
        collectionName,
        slug,
        categoryName,
        categoryId:category._id ? category._id :'',
        productType,
        products,
        status,
        image:req.file ? req.file.filename : ''
    })
    const data=await collection.save();
    res.status(200).json({message:"Collection created Successfully",success:true,data:data})
}catch(err){
    console.log(err)
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
}
module.exports.getCollection=async(req,res)=>{
    try{
        const keyword=req.query.keyword
        ? {
            collectionName:{
                $regex:req.query.keyword,
                $options:"i"
            }
        }:{};
const data=await collectionModel.find({...keyword}).sort({'createdAt':-1});
res.status(200).json({message:"All collection retreived",success:true,data:data})
    }catch(err){
res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
    }
}
module.exports.deleteCollection=async(req,res)=>{
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
}
module.exports.updateCollection=async(req,res)=>{
    try{
const id=req.params.id;
const {collectionName,slug,categoryName,productType,products,status}=req.body

const collection=await collectionModel.findById(id)
if(!collection){
    return res.status(404).json({message:"collection doesn't exist",success:false})
}
if(req.file){
    fs.unlink(path.join(__dirname,'../uploads/'+collection.image),fileHandler);
}
if(categoryName){
    var category=await categoryModel.findOne({categoryName})
}

const data={
    collectionName,
    slug:slug ? slugify(slug) :collection.slug,
    categoryName,
    categoryId:category?._id ? category._id :collection.categoryId,
    productType,
    products,
    status,
    image:req.file ? req.file.filename : collection.fileName
}
  const col=  await collectionModel.findByIdAndUpdate(id,data,{
        new: true
        })
res.status(200).json({message:"collection updated Successfully",success:true,data:col})
    }catch(err){
        res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
    }
}
