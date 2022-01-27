const slugify=require('../utils/slugify');
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
        },
        currated_Products:{
            type:Array
        }
    },
    trialProduct:{
        productType:{
            type:String,
          
        },
        trial_Product:{
            type:Array
        }
    },
    sponsoredProduct:{
        productType:{
            type:String,
           required:true
        },
        sponsored_Product:{
            type:Array
        }
    },
    status:{
        type:Boolean,
        default:true,
        required:true
    }

},{timestamps:true})



customCollectionSchema.pre('save',async function(next){
this.slug=slugify(this.slug)
next();
})

const customCollectionModel=mongoose.model('customCollection',customCollectionSchema);
module.exports=customCollectionModel;