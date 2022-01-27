const slugify=require('../utils/slugify');
const mongoose=require('mongoose');
const Schema=mongoose.Schema
const collectionSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    collectionName:{
        type:String,
        required:[true,"Please fill the Product Name"]
    },
    slug: {
        type: String,
        required: [true, 'Please fill the Slug Name'],
    },
    categoryName:{
        type:String,
        required:true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    productType:{
    type:String,
    required: true
},
products:{
    type:Array
},
    status:{
    type:Boolean,
    required:true
},
    image:{
    type:String,
    required:true
}
},{timestamps:true})



collectionSchema.pre('save',async function(next){
    this.slug=slugify(this.slug)
    next();
})

const collectionModel=mongoose.model('collection',collectionSchema)
module.exports=collectionModel;