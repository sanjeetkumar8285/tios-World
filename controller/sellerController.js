const sellerModel = require('../models/seller');
var userModel = require("../models/User");
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');


const fileHandler = (err, doc) => {
    if (err) {
        console.log('Unlink failed', err)
    }
}

module.exports.createSeller= async (req, res) => {

    try {
        const { name, email, password, phone, type, businessTitle, tagline, aboutBusiness, aboutFounder,
            founderName1, founderName2, founderName3, commisionType, commisionPercentage, payoutTime } = req.body


        const encryptPassword = await bcrypt.hash(password, 10)


        const seller = new sellerModel({
            userId: req.user._id,
            name,
            email,
            password: encryptPassword,
            phone,
            type,
            businessTitle,
            tagline: tagline,
            aboutBusiness,
            aboutFounder,
            logo: req.files.logo ? req.files.logo[0].filename : undefined,
            coverImage: req.files.coverImage ? req.files.coverImage[0].filename : undefined,
            founder1: {
                founderImage1: req.files.founderImage1 ? req.files.founderImage1[0].filename : undefined,
                founderName1
            },
            founder2: {
                founderImage2: req.files.founderImage2 ? req.files.founderImage2[0].filename : undefined,
                founderName2
            },
            founder3: {
                founderImage3: req.files.founderImage3 ? req.files.founderImage3[0].filename : undefined,
                founderName3
            },
            commision: {
                commisionType,
                commisionPercentage
            },
            payoutTime
        })
        const data = await seller.save();
        //save seller  in userModel
        const userdata = new userModel({
            name: data.name,
            email: data.email,
            password: data.password,
            role: "seller"
        })
        await userdata.save();
        res.status(201).json({ message: "Seller registered successfully", success: true, data: data })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}
 module.exports.getSeller=async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [{
                    name: {
                        $regex: req.query.keyword,
                        $options: "i"
                    },
                }, {
                    email: {
                        $regex: req.query.keyword,
                        $options: "i"
                    }
                }]
            } : {}
        const data = await sellerModel.find({ ...keyword }).sort({ 'createdAt': -1 })
        res.status(200).json({ message: "All seller retreived", success: true, data: data })
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}
 module.exports.deleteSeller=async (req, res) => {
    try {
        const id = req.params.id;
        const seller = await sellerModel.findById(id)
        if(!seller){
            return res.status(404).json({message:"Seller with this id doesn't exist",success:false})
        }
        if (seller.logo) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.logo), fileHandler)
        }
        if (seller.coverImage) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.coverImage), fileHandler)
        }
        if (seller.founder1.founderImage1) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.founder1.founderImage1), fileHandler)
        }
        if (seller.founder2.founderImage2) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.founder2.founderImage2), fileHandler)
        }
        if (seller.founder3.founderImage3) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.founder3.founderImage3), fileHandler)
        }

        const userData = await userModel.findOne({ email: seller.email })
        if (userData) {
            await userData.remove();
        }
        const data = await seller.remove();
        res.status(200).json({ message: "seller deleted successfully", success: true, data: data })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}
module.exports.updateSeller=async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, phone, type, businessTitle, tagline, aboutBusiness, aboutFounder,
            founderName1, founderName2, founderName3, commisionType, commisionPercentage, payoutTime } = req.body
            
        const seller = await sellerModel.findById(id);
        if(!seller){
            return res.status(404).json({message:"Seller with this id doesn't exist",success:false})
        }
        if (req.files.logo) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.logo), fileHandler)
        }
        if (req.files.coverImage) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.coverImage), fileHandler)
        }
        if (req.files.founderImage1) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.founder1.founderImage1), fileHandler)
        }
        if (req.files.founderImage2) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.founder2.founderImage2), fileHandler)
        }
        if (req.files.founderImage3) {
            fs.unlink(path.join(__dirname, '../uploads/' + seller.founder3.founderImage3), fileHandler)
        }
  
        const data = await sellerModel.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            type,
            businessTitle,
            tagline: tagline,
            aboutBusiness,
            aboutFounder,
            logo: req.files.logo ? req.files.logo[0].filename : seller.logo,
            coverImage: req.files.coverImage ? req.files.coverImage[0].filename : seller.coverImage,
            "founder1.founderImage1": req.files.founderImage1 ? req.files.founderImage1[0].filename : seller.founder1.founderImage1,
            "founder1.founderName1":founderName1,
            "founder2.founderImage2": req.files.founderImage2 ? req.files.founderImage2[0].filename : seller.founder2.founderImage2,
            "founder2.founderName2":founderName2,
            "founder3.founderImage3": req.files.founderImage3 ? req.files.founderImage3[0].filename : seller.founder3.founderImage3,
            "founder3.founderName3":founderName3,
            "commision.commisionType":commisionType,
            "commision.commisionPercentage":commisionPercentage,
            payoutTime
        },{new:true})
        if(email || name){
            const user=await userModel.findOne({email:seller.email})
            await userModel.findByIdAndUpdate(user._id,{
                name,email
            })
        }
       
        res.status(200).json({ message: 'seller updated successfully', success: true, data: data })
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Something went wrong", success: false, err: err })
    }
}