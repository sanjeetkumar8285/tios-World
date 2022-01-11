const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const customCollectionSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    collectionName:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    curratedProducts:{
        productType:{
            type:String,
            required:true
        },
        productName:{
            type:String,
            required:true
        }
    },
    trialProduct:{
        productType:{
            type:String,
            required:true
        },
        productName:{
            type:String,
            required:true
        }
    },
    sponsoredProduct:{
        productType:{
            type:String,
            required:true
        },
        productName:{
            type:String,
            required:true
        }
    },
    status:{
        type:Boolean,
        required:true
    }

},{timestamps:true})

const customCollectionModel=mongoose.model('customCollection',customCollectionSchema);
module.exports=customCollectionModel;