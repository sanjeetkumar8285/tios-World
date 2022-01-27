const specsUnitModel=require('../models/specsUnit');
const specsModel=require('../models/specs');

module.exports.createSpecsUnit=async(req,res)=>{
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
        res.status(400).json({message:"Something went wrong",success:false,err:err.message})
    }
    }

module.exports.getSpecsUnit=async(req,res)=>{
        try{
           const keyword=req.query.keyword
           ? {
               $or:[{
                   specsName:{
                       $regex:req.query.keyword,
                       $options:"i"
                   },
               },{
                   unitName:{
                       $regex:req.query.keyword,
                       $options:"i"
                   }
               }]
           }:{}
        const data=await specsUnitModel.find({...keyword}).sort({'createdAt':-1})
        res.status(200).json({message:'All specs Units retreived',success:true,data})
        }catch(err){
            res.status(400).json({message:"Something went wrong",success:false,err:err.message})
        }
        }
module.exports.deleteSpecsUnit=async(req,res)=>{
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
    }
module.exports.updateSpecsUnit=async(req,res)=>{
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
        }