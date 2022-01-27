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
        required: [true, 'Please fill the password field'],
    },
    phone: {
        type: String,
        required: [true, 'Please fill phone number field'],
    },
    type:{
        type:String,
        required:true
    },
    logo:{
        type:String
    },
    coverImage:{
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
    aboutFounder:{
        type:String,
        required:true
    },
    founder1:{
        founderImage1:{
        type:String
        },
        founderName1:{
        type:String
        }
    },
    founder2:{
        founderImage2:{
        type:String
        },
        founderName2:{
        type:String
        }
    },
    founder3:{
        founderImage3:{
        type:String
        },
        founderName3:{
        type:String
        }
    },
    commision:{
        commisionType:{
            type:String,
            required:true
        },
        commisionPercentage:{
            type:Number
        }
    },
    payoutTime:{
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