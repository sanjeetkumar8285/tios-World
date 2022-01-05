const mongoose=require('mongoose');
const Schema=mongoose.Schema
const variationSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    variationName:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    }

},{timestamps:true})

const variationModel=mongoose.model('variation',variationSchema)

module.exports=variationModel;