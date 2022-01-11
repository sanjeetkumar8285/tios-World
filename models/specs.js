const mongoose=require('mongoose');
const Schema=mongoose.Schema
const variationSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
   specsName:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    }

},{timestamps:true})

const specsModel=mongoose.model('specs',variationSchema)

module.exports=specsModel;