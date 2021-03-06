const mongoose=require('mongoose');
const Schema=mongoose.Schema
const variationSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    variationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'variation'
    },
    variationName:{
        type:String,
        required:true
    },
    unitName:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    }

},{timestamps:true})

const variationModel=mongoose.model('variationUnit',variationSchema)

module.exports=variationModel;