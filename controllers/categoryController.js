const Category = require('../models/categorySchema');
const { errorHandler } = require('../utils/errorHandler');

exports.getAllCategory = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, response: categories });
    } catch (error) {
        next(error);
    }
};

exports.addCategory = async (req, res, next) => {

    const { category } = req.body;

    if (!category) {
        return next(errorHandler(403, "enter all the fields"));
    }

    const newCategory = new Category({
        category
    })

    try {
        await newCategory.save();
        res.status(201).json({ message: "category added successfully", sucess: true })
    } catch (error) {
        next(error)
    }

}

exports.getCategoryList = async (req, res, next) => {

}