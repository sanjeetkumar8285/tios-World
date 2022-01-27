const specsModel=require('../models/specs');
module.exports.createSpecs=async(req,res)=>{
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
}

module.exports.getSpecs=async(req,res)=>{
    try{
        const keyword=req.query.keyword
        ? {
            specsName:{
            $regex:req.query.keyword,
            $options:"i"
            }
        }:{};
        const data=await specsModel.find({...keyword}).sort({'createdAt':-1});
        res.status(200).json({message:"All specs retreived",success:true,data})
            }catch(err){
                res.status(400).json({message:"Something went wrong",success:false,err:err})
            }
}

module.exports.updateSpecs=async(req,res)=>{
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
}

module.exports.deleteSpecs=async(req,res)=>{
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
}