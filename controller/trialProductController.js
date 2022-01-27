const trialProductsModel = require('../models/trialProduct') 

const fileHandler = (err, doc) => {
    if (err) {
        console.log('Unlink failed', err)
    }
}


module.exports.createTrialProduct=async (req, res) => {
    try {
        const { product, tiosPoint, category, productName, ratingNumber, ratingStar, purchasePrice, sellingPrice,
            discountPercentage, savingPrice, taxType, taxPercentage, taxPrice, specsName, specsUnit, weight, color, size,
            stock, origin, originType, certification, productIdentificationType, productIdentificationNumber, processShortDetail,
            processDescription, status
        } = req.body


        let galleryImages;
        if (req.files.galleryImages) {
            galleryImages = req.files.galleryImages.map((data) => {
                return data.filename
            })
        }
        else {
            galleryImages = []
        }

        let processImage;
        if (req.files.processImage) {
            processImage = req.files.processImage.map((data) => {
                return data.filename
            })
        }
        else {
            processImage = []
        }

        const trialProduct = new trialProductsModel({
            userId: req.user._id,
            product,
            tiosPoint,
            category,
            productName,
            rating: {
                number: ratingNumber,
                star: ratingStar
            }, price: {
                purchasePrice,
                sellingPrice,
                discountPercentage,
                savingPrice,
                taxType,
                taxPercentage,
                taxPrice
            },
            specsAndVariation: {
                specsName,
                specsUnit,
                weight,
                color,
                size
            },
            stock,
            originDetails: {
                origin,
                originType,
                certification,
                mapImage: req.files.mapImage ? req.files.mapImage[0].filename : undefined
            },
            productIdentification: {
                type: productIdentificationType,
                number: productIdentificationNumber
            },
            productImage: {
                frontImage:req.files.frontImage ? req.files.frontImage[0].filename : undefined,
                backImage:req.files.backImage ? req.files.backImage[0].filename : undefined,
                galleryImages:galleryImages
            },
            processDetails: {
                processShortDetail,
                processDescription,
                processImage: processImage
            },
            status
        })
        const data = await trialProduct.save();
        res.status(201).json({ message: "Trial product added Successfuly", success: false, data: data })
    } catch (err) {
        res.status(400).json({ message: "Something Went wrong", success: false, err: err.message })
    }
}
module.exports.getTrialProduct=async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                productName: {
                    $regex: req.query.keyword,
                    $options: "i"
                }
            } : {};
        const data = await trialProductsModel.find({ ...keyword }).sort({ 'createdAt': -1 });
        res.status(200).json({ message: "All trial Product retreived", success: true, data })
    } catch (err) {
        res.status(400).json({ message: "Something Went wrong", success: false, err: err.message })
    }
}
module.exports.deleteTrialProduct=async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const trialProduct = await trialProductsModel.findById(id)
        if (!trialProduct) {
            return res.status(404).json({ message: "product not found", message: false });
        }
        if (trialProduct.originDetails.mapImage) {
            fs.unlink(path.join(__dirname, '../uploads/' + trialProduct.originDetails.mapImage), fileHandler);
        }
        if (trialProduct.productImage.frontImage) {
            fs.unlink(path.join(__dirname, '../uploads/' + trialProduct.productImage.frontImage), fileHandler);
        }
        if (trialProduct.productImage.backImage) {
            fs.unlink(path.join(__dirname, '../uploads/' + trialProduct.productImage.backImage), fileHandler);
        }
        if (trialProduct.productImage.galleryImages) {
            trialProduct.productImage.galleryImages.map((data) => {
                fs.unlink(path.join(__dirname, '../uploads/' + data), fileHandler);
            })
        }
        if (trialProduct.processDetails.processImage) {
            trialProduct.processDetails.processImage.map((data) => {
                fs.unlink(path.join(__dirname, '../uploads/' + data), fileHandler);
            })
        }
        const data = await trialProduct.remove();
        res.status(200).json({ message: "product deleted successfully", success: true, data });
    } catch (err) {
        res.status(400).json({ message: "Something Went wrong", success: false, err: err.message })
    }
}
module.exports.updateTrialProduct=async (req, res) => {
    try {
        const { product, tiosPoint, category, productName, ratingNumber, ratingStar, purchasePrice, sellingPrice,
            discountPercentage, savingPrice, taxType, taxPercentage, taxPrice, specsName, specsUnit, weight, color, size,
            stock, origin, originType, certification, productIdentificationType, productIdentificationNumber, processShortDetail,
            processDescription, status
        } = req.body
        const id = req.params.id;
        const trialProduct = await trialProductsModel.findById(id)
        if (!trialProduct) {
            return res.status(404).json({ message: "product not found", success: false })
        }
        if (req.files.mapImage) {
            fs.unlink(path.join(__dirname, '../uploads/' + trialProduct.originDetails.mapImage), fileHandler)
        }
        if (req.files.frontImage) {
            fs.unlink(path.join(__dirname, '../uploads/' + trialProduct.productImage.frontImage), fileHandler)
        }
        if (req.files.backImage) {
            fs.unlink(path.join(__dirname, '../uploads/' + trialProduct.productImage.backImage), fileHandler)
        }
        if (req.files.galleryImages) {
            trialProduct.productImage.galleryImages.map((data) => {
                fs.unlink(path.join(__dirname, '../uploads/' + data), fileHandler);
            })
        }
        if (req.files.processImage) {
            trialProduct.processDetails.processImage.map((data) => {
                fs.unlink(path.join(__dirname, '../uploads/' + data), fileHandler);
            })
        }

        let galleryImages;
        if (req.files.galleryImages) {
            galleryImages = req.files.galleryImages.map((data) => {
                return data.filename
            })
        }


        let processImage;
        if (req.files.processImage) {
            processImage = req.files.processImage.map((data) => {
                return data.filename
            })
        }


        const data = await trialProductsModel.findByIdAndUpdate(id, {
            product,
            tiosPoint,
            category,
            productName,
            "rating.number": ratingNumber,
            "rating.star": ratingStar,
            "price.purchasePrice": purchasePrice,
            "price.sellingPrice": sellingPrice,
            "price.discountPercentage": discountPercentage,
            "price.savingPrice": savingPrice,
            "price.taxType": taxType,
            "price.taxPercentage": taxPercentage,
            "price.taxPrice": taxPrice,

            "specsAndVariation.specsName": specsName,
            "specsAndVariation.specsUnit": specsUnit,
            "specsAndVariation.weight": weight,
            "specsAndVariation.color": color,
            "specsAndVariation.size": size,

            stock,

            "originDetails.origin": origin,
            "originDetails.originType": originType,
            "originDetails.certification": certification,
            "originDetails.mapImage": req.files.mapImage ? req.files.mapImage[0].filename : trialProduct.originDetails.mapImage,

            "productIdentification.type": productIdentificationType,
            "productIdentification.number": productIdentificationNumber,

            "productImage.frontImage": req.files.frontImage ? req.files.frontImage[0].filename : trialProduct.productImage.frontImage,
            "productImage.backImage": req.files.backImage ? req.files.backImage[0].filename : trialProduct.productImage.backImage,
            "productImage.galleryImages":galleryImages,

            "processDetails.processShortDetail": processShortDetail,
            "processDetails.processDescription": processDescription,
            "processDetails.processImage": processImage,

            status
        },{new:true})
        res.status(200).json({ message: "Trial product updated Successfully", success: true,data })
    } catch (err) {
        res.status(400).json({ message: "Something Went wrong", success: false, err: err.message })
    }
}
