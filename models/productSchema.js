const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  ram: String,
  price: Number,
  quantity: Number
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  variants: [variantSchema],
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  description: {
    type: String
  },
  images: [String] 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
