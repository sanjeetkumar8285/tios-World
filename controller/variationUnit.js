const variationModel = require('../models/variations')
const variationUnitModel = require('../models/variationsUnit');

module.exports.createVariationUnit = async (req, res) => {
    try {
        const { variationName, unitName, status } = req.body
        const variationData = await variationModel.findOne({ variationName })
        const variations = new variationUnitModel({
            variationId: variationData._id,
            variationName,
            unitName,
            status
        })
        const data = await variations.save();
        res.status(201).json({ message: "variation unit created Successfully", success: true, data: data })
    } catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}
module.exports.getVariationUnit = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    {
                        variationName: {
                            $regex: req.query.keyword,
                            $options: "i"
                        }
                    },
                    {
                        unitName: {
                            $regex: req.query.keyword,
                            $options: "i"
                        }
                    }
                ]
            } : {};
        const data = await variationUnitModel.find({ ...keyword }).sort({ 'createdAt': -1 })
        res.status(200).json({ message: 'variation Units retreived', success: true, data })
    } catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}
module.exports.updateVariationUnit = async (req, res) => {
    try {
        const id = req.params.id
        const { variationName, unitName, status } = req.body
        const variations = await variationUnitModel.findById(id)
        if (!variations) {
            return res.status(404).json({ message: "Variation unit doesn't exist", success: false })
        }
        const variationData = await variationModel.findOne({ variationName })
        const data = await variationUnitModel.findByIdAndUpdate(id, {
            variationId: variationData._id,
            variationName,
            unitName, status
        })
        res.status(200).json({ message: "variationUnit updated Successfully", success: true })
    } catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}

module.exports.deleteVariationUnit = async (req, res) => {
    try {
        const id = req.params.id
        const variation = await variationUnitModel.findById(id)
        if (!variation) {
            return res.status(404).json({ message: "variation Unit doesn't exist", success: false })
        }
        const data = await variation.remove();
        res.status(200).json({ message: "variation Unit deleted Successfully", success: true, data: data })
    } catch (err) {
        res.status(400).json({ message: "Something went wrong", success: false, err: err.message })
    }
}