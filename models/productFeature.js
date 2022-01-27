const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const productFeaturesSchema=new Schema({
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
},
name:{
    type:String,
    required:true
},
icon:{
    type:String
},
status:{
    type:Boolean,
    default:true,
}
},{timestamps:true})

const productFeaturesModel=mongoose.model('productFeature',productFeaturesSchema)
module.exports=productFeaturesModel