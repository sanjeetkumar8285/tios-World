const slugify=require('../utils/slugify');
const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const categorySchema=new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    categoryName: {
        type: String,
        required: [true, 'Please fill the category name'],
    },
    slug: {
        type: String,
        index:true
    }, 
    regularDetails:{
        type:String,
    },
    organicDetails:{
        type:String,
    },
    bannerImage:{
        type:String
    },
    isEndLevelCategory:{
        type:Boolean,
        default:false
    },
    parent_Id: {
        type: mongoose.Schema.Types.ObjectId,
        default:null,
        ref: 'category'
    },

},{timestamps:true})




  categorySchema.pre('save', async function (next) {
    this.slug = slugify(this.categoryName);
    next();
});

    const autoPopulateChildren = function (next) {
        this.populate('parent_Id');
        next();
    };
    
categorySchema.pre('find', autoPopulateChildren)
    


const categoryModel=mongoose.model('category',categorySchema)

module.exports=categoryModel
  