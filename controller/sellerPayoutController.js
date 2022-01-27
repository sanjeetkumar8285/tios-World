const sellerPayoutModel=require('../models/sellerPayout');

module.exports.createSellerPayout=async(req,res)=>{
try{
const {orderId,returnOrderId,payoutDate,no,lastPayoutCycleCommission,lastPayoutDate,
    lastPayoutCycleSales,lastPayoutAmount,payoutDeliveryFees,status
}=req.body
console.log(req.body)
const data= await sellerPayoutModel.create({
    userId:req.user._id,
    ...req.body
})
res.status(201).json({message:"sellerPayout created successfull",success:true,data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
}
module.exports.getSellerPayout=async(req,res)=>{
    try{
        const keyword=req.query.keyword ?
        {
            orderId:{
                $regex:keyword,
                $options:"i"
            }
        }:{}
        const data=await sellerPayoutModel.find({...keyword}).sort({'createdAt':-1})
res.status(200).json({message:"data retreived",success:true,data})
    }
catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
}
module.exports.deleteSellerPayout=async(req,res)=>{
try{
const id=req.params.id
const sellerPayout=await sellerPayoutModel.findById(id)
if(!sellerPayout){
    return res.status(404).json({message:"data with this id doesn't exist",success:false});
}
const data=await sellerPayout.remove();
res.status(200).json({message:"data deleted successfully",success:true,data})

}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
}
module.exports.updateSellerPayout=async(req,res)=>{
try{
    const id=req.params.id
    const sellerPayout=await sellerPayoutModel.findById(id)
    if(!sellerPayout){
        return res.status(404).json({message:"data with this id doesn't exist",success:false});
    }
const data=await sellerPayoutModel.findByIdAndUpdate(id,{...req.body},{new:true})
res.status(400).json({message:"data updated successfully",success:true,data})
}catch(err){
    res.status(400).json({message:"Something went wrong",success:false,err:err.message})
}
}