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
    parent_Id: {
        type: mongoose.Schema.Types.ObjectId,
        default:null,
        ref: 'category'
    },

},{timestamps:true})

function slugify(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }


  categorySchema.pre('save', async function (next) {
    this.slug = slugify(this.categoryName);
    next();
});
    const autoPopulateChildren = function (next) {
        this.populate('parent_Id');
        next();
    };
    
    categorySchema
.pre('find', autoPopulateChildren)
    


const categoryModel=mongoose.model('category',categorySchema)

module.exports=categoryModel
  