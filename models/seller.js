const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const sellerSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    name: {
        type: String,
        required: [true, 'Please fill the name field'],
    },

    email: {
        type: String,
        required: [true, 'Please fill email field'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        lowercase: true,
    },
    password: {
        type: String,
        // required: [true, 'Please fill the password field'],
    },
    phone: {
        type: String,
        required: [true, 'Please fill phone number field'],
    },
    logo:{
        type:String
    },
    businessTitle: {
        type: String,
        required: [true, 'Please fill the businessTitle name field'],
    },
    tagline: {
        type: String,
        required: [true, 'Please fill the tagline name field'],
    },
    aboutBusiness: {
        type: String,
        required: [true, 'Please fill the aboutBusiness name field'],
    },
    images:{
        type:Array
    },
    aboutFounder:{
        type:String,
        required:true
    },
    role:{
        type:String
    },
    status:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const sellerModel=mongoose.model('seller',sellerSchema)
module.exports=sellerModel;