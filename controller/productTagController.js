const productTagModel = require('../models/productTags')

module.exports.createProductTag = async (req, res) => {
    try {
        const { tagName, color, status } = req.body
        const productTag = new productTagModel({
            userId: req.user._id,
            tagName,
            color, status
        })
        const data = await productTag.save();
        res.status(400).json({ message: "productTag created Successfully", success: true, data })
    } catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}
module.exports.getProductTag = async (req, res) => {
    try {
        const keyword = req.query.keyword ?
            {
                tagName: {
                    $regex: req.query.keyword,
                    $options: "i"
                }
            } : {}
        const data = await productTagModel.find({ ...keyword }).sort({ 'createdAt': -1 })
        res.status(400).json({ message: "data retrived", success: true, data })
    } catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}
module.exports.deleteProductTag = async (req, res) => {
    try {
        const id = req.params.id
        const productTag = await productTagModel.findById(id)
        if (!productTag) {
            return res.status(404).json({ message: "data doesn't exist with this id", success: false })
        }
        const data = await productTag.remove();
        res.status(200).json({ message: "productTag data deleted Successfully", success: true, data })
    } catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}

module.exports.updateProductTag = async (req, res) => {
    try {
        const id = req.params.id
        const { tagName, color, status } = req.body;
        const productTag = await productTagModel.findById(id)
        if (!productTag) {
            return res.status(404).json({ message: "data doesn't exist with this id", success: false })
        }
        const data = await productTagModel.findByIdAndUpdate(id, {
            tagName,
            color,
            status
        }, { new: true })

        res.status(400).json({ message: "productTag updated Successfully", success: true, data })
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}