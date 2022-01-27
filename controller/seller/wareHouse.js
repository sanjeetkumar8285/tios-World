const wareHouseModel=require('../../models/wareHouse');

module.exports.createWareHouse=async(req,res)=>{
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
    }
module.exports.getWareHouse=async(req,res)=>{
    try{
        const keyword=req.query.keyword
        ? {
            wareHouseName:{
                $regex:req.query.keyword,
                $options:"i"
            }
        }:{};
        const data=await wareHouseModel.find({...keyword}).sort({'createdAt':-1})
        res.status(200).json({message:"all warehouse retrieved",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err.message});
    }
    }
module.exports.deleteWareHouse=async(req,res)=>{
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
}
module.exports.updateWareHouse=async(req,res)=>{
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
    }