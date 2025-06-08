const Product = require('../models/productSchema');
const User = require('../models/userSchema');
const { errorHandler } = require('../utils/errorHandler');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

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

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';

    let skip = (page - 1) * limit;
    const filter = search.trim().length > 0
        ? { title: { $regex: search, $options: 'i' } }
        : {};

    try {
        const products = await Product.find(filter).skip(skip).limit(limit).sort({ createdAt: 1 });;
        const total = await Product.countDocuments();

        res.status(200).json({
            success: true,
            response: products,
            total
        });
    } catch (error) {
        next(error);
    }

}

exports.getSingleProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.status(200).json({
            success: true,
            response: product
        });
    } catch (error) {
        next(error);
    }
}

exports.editProduct = async (req, res, next) => {
    const { title, subCategoryId, variants, description } = req.body;
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        let parsedVariants = JSON.parse(variants);

        if (!title || !description || !subCategoryId || parsedVariants.length === 0) {
            return next(errorHandler(400, "All fields are required"));
        }

        //deleting existing image
        if (req.files && req.files.length > 0) {
            if (product.images && product.images.length > 0) {
                product.images.forEach((img) => {
                    const imgPath = path.join(__dirname, "../uploads", img);
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                });
            }
            const imageNames = req.files.map(file => file.filename);
            product.images = imageNames;
        }

        product.title = title;
        product.description = description;
        product.subCategoryId = subCategoryId;
        product.variants = parsedVariants;

        await product.save();

        res.status(200).json({ success: true, message: "Product updated successfully", response: product });
    } catch (error) {
        next(error);
    }
};

exports.getWishListProducts = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const wishList = user.wishList;

        if (!Array.isArray(wishList) || wishList.length === 0) {
            return res.status(200).json({ success: true, response: [] });
        }

        const objectIds = wishList.map(id => new mongoose.Types.ObjectId(id));

        const products = await Product.find({
            _id: { $in: objectIds }
        });

        res.status(200).json({
            success: true,
            response: products,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.removeWishList = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(403, "user not exist"))
    const productId = req.params.id;
    const index = user.wishList.indexOf(productId);
    try {
        user.wishList.splice(index, 1);
        await user.save();
        const { password: pass, ...rest } = user._doc;
        return res.json({ success: true, message: "Removed from wishlist", response: rest });
    } catch (error) {
        next(error);
    }
}