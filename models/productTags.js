const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const tagSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    tagName:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    }

},{timestamps:true})

const productTagModel= mongoose.model('productTag',tagSchema)
module.exports=productTagModel;