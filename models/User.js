const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');

const Schema=mongoose.Schema;
const userSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'user'
    }
},{timestamps:true})




userSchema.methods.generateToken=async function(){
    try{
        const token=jwt.sign({id:this._id},process.env.TOKEN_KEY)
        return token;
    }
    catch(error){
        console.log(err)
    }
    
}
const userModel=mongoose.model('user',userSchema)
module.exports=userModel