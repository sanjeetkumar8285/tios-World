const mongoose=require('mongoose');
const Schema=mongoose.Schema
const wareHouseSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    wareHouseName:{
        type:String,
        required:true
    },
    contact_person_name:{
        type:String,
        required:true
    },
    contact_person_no:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    }
},{
timestamps:true
})

const wareHouseModel=mongoose.model('wareHouse',wareHouseSchema);
module.exports=wareHouseModel;