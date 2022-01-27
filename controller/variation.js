const variationModel=require('../models/variations')
module.exports.createVariation=async(req,res)=>{
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
}
module.exports.getVariation=async(req,res)=>{
    try{
        const keyword=req.query.keyword
        ? {
            variationName:{
            $regex:req.query.keyword,
            $options:"i"
            }
        }:{};
const data=await variationModel.find({...keyword}).sort({'createdAt':-1});
res.status(200).json({message:"variation data retreived",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
}
module.exports.updateVariation=async(req,res)=>{
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
}
module.exports.deleteVariation=async(req,res)=>{
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
}
