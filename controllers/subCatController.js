const Subcategory = require('../models/subCatSchema');
const { errorHandler } = require('../utils/errorHandler');

exports.addSubCategory = async (req, res, next) => {

    const { subCategory: title, categoryId } = req.body;

    if (!title || !categoryId) {
        return next(errorHandler(403, "enter all the fields"));
    }

    const newSubCategory = new Subcategory({
        title, categoryId
    })

    try {
        await newSubCategory.save();
        res.status(201).json({ message: "sub category added successfully", sucess: true })
    } catch (error) {
        next(error)
    }

}

exports.getAllSubCategory = async (req, res, next) => {
    try {
        const Subcategories = await Subcategory.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, response: Subcategories });
    } catch (error) {
        next(error);
    }
};
