const categoryModel=require('../models/Category');
const slugify=require('../utils/slugify');
const fs=require('fs');
const path=require('path');

const fileHandler=(err,doc)=>{
    if(err){
        console.log('Unlink failed',err)
    }
}

module.exports.createCategory=async(req,res)=>{
    try{
        const {categoryName,parentCategory,regularDetails,organicDetails,isEndLevelCategory}=req.body
        let parent;
        if(parentCategory){
         parent=await categoryModel.findOne({categoryName:parentCategory})
        }
    
   let category=new categoryModel({
        userId:req.user._id,
        categoryName,
        regularDetails,
        organicDetails,
        bannerImage:req.file ? req.file.filename : undefined,
        isEndLevelCategory,
        parent_Id:parent ? parent._id :null
    })

        const data=await category.save();
        res.status(201).json({message:"catgory added successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:true,err:err.message})
    }
}

module.exports.getCategory=async(req,res)=>{
    try{
        const keyword=req.query.keyword
        ?  {
            categoryName:{
                $regex:req.query.keyword,
                $options:"i"
            }
        }
        :{};
        const data=await categoryModel.find({...keyword}).sort({'createdAt':-1})
        res.status(200).json({message:"category Data",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
}

module.exports.updateCategory=async(req,res)=>{
    try{
    const id=req.params.id
    const {categoryName,parentCategory,regularDetails,organicDetails,isEndLevelCategory}=req.body
    const categoryExist=await categoryModel.findById(id);
    if(!categoryExist){
        return res.status(404).json({message:"category doesn't exist",success:false})
    }
    let parent;
    if(parentCategory){
        parent=await categoryModel.findOne({categoryName:parentCategory})
       }
    if(req.file){
        fs.unlink(path.join(__dirname,'../uploads/'+categoryExist.bannerImage),fileHandler);
    }
    
    const data=await categoryModel.findByIdAndUpdate(id,{
        categoryName,
        slug:slugify(categoryName),
        regularDetails,
        organicDetails,
        bannerImage:req.file ? req.file.filename : categoryExist.bannerImage,
        isEndLevelCategory,
        parent_Id:parent ? parent._id :categoryExist.parent_Id

    },{new:true})
    res.status(200).json({message:"category uploaded successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
    }

module.exports.deleteCategory=async(req,res)=>{
    try{
    const id=req.params.id
    const category=await categoryModel.findById(id);
    if(!category){
        return res.status(404).json({message:"category doesn't exist",success:false})
    }
    if(category.bannerImage){
        fs.unlink(path.join(__dirname,'../uploads/'+category.bannerImage),fileHandler);
    }
    const data=await category.remove();
    res.status(400).json({message:"category deleted successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
    }
 
