const Product = require('../models/productSchema');
const { errorHandler } = require('../utils/errorHandler');

exports.addProduct = async (req, res, next) => {

    const { title, subCategoryId, variants, description } = req.body;

    let imageNames;
    let parsedVariants = JSON.parse(variants);
    if (req.files) {
        imageNames = req.files.map(file => file.filename);
    }

    if (!title || !description || !subCategoryId || parsedVariants.length == 0) {
        return next(errorHandler(403, "enter all the fields"));
    }
    try {

        const newProduct = new Product({
            title,
            description,
            subCategoryId,
            variants: parsedVariants,
            images: imageNames,
        });

        await newProduct.save();

        res.status(201).json({ success: true, message: "Product added successfully", response: newProduct });

    } catch (error) {
        next(error)
    }
}

exports.getProducts = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    try {
        const products = await Product.find().skip(skip).limit(limit);
        const total = await Product.countDocuments();
        res.status(200).json({
            success: true,
            response: products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        next(error);
    }

}