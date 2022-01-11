const mongoose=require('mongoose');
const Schema=mongoose.Schema
const specsUnitSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    specsId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'specs'
    },
    specsName:{
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

const specsUnitModel=mongoose.model('specsUnit',specsUnitSchema)

module.exports=specsUnitModel;