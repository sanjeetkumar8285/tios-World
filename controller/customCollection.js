const customCollectionModel=require('../models/customCollection')
const slugify=require('../utils/slugify')
module.exports.createCustomCollection=async(req,res)=>{
    try{
        const {name,slugName,curatedType,currated_Products,trialType,trial_Product,sponsoredType,sponsored_Product,status}=req.body
        const customCollection=new customCollectionModel({
            userId:req.user._id,
            collectionName:name,
             slug:slugName,
            curratedProducts:{
                productType:curatedType,
                currated_Products:currated_Products
            },
            trialProduct:{
                productType:trialType,
                trial_Product:trial_Product
            },
            sponsoredProduct:{
                productType:sponsoredType,
                sponsored_Product:sponsored_Product
            },
            status
        })
        const data=await customCollection.save();
        res.status(201).json({message:"custom collection created Successfully",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
    }
}
module.exports.getCustomCollection=async(req,res)=>{
    try{
        const keyword=req.query.keyword
        ?  {
            collectionName:{
                $regex:req.query.keyword,
                $options:"i"
            }
        }
        :{};
    const data=await customCollectionModel.find({...keyword}).sort({'createdAt':-1})
    res.status(200).json({message:"All customCollection created",success:true,data})
    }catch(err){
        res.status(400).json({message:"Something Went Wrong",success:false,err:err.message})
    }
    }
module.exports.deleteCustomCollection=async(req,res,next)=>{
    try{
const id=req.params.id
const customCollection=await customCollectionModel.findById(id);
if(!customCollection){
    return res.status(404).json({message:"customCollection didn't find",success:false})
}
const data=await customCollection.remove();
res.status(404).json({message:"customCollection deleted successfully",success:true,data})
    }catch(err){
        res.status(404).json({message:"Something went wrong",success:false})
    }
}

module.exports.updateCustomCollection=async(req,res,next)=>{
    try{
const id=req.params.id;
const {name,slugName,curatedType,currated_Products,trialType,trial_Product,sponsoredType,sponsored_Product,status}=req.body
const customCollection=await customCollectionModel.findById(id);
if(!customCollection){
    return res.status(404).json({message:"customCollection didn't find",success:false})
}
await customCollectionModel.findByIdAndUpdate(id,{
    collectionName:name,
    slug:slugname ? slugify(slugName) : customCollection.slug,
   "curratedProducts.productType":curatedType,
   "curratedProducts.currated_Products":currated_Products,
   "trialProduct.productType":trialType,
   "trialProduct.trial_Product":trial_Product,
   "sponsoredProduct.productType":sponsoredType,
   "sponsoredProduct.sponsored_Product":sponsored_Product,
   status
})
res.status(200).json({message:"customCollection updated successfully",success:true})
    }catch(err){
        res.status(404).json({message:"Something went wrong",success:false})
    }
}