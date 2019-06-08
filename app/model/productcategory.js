/**
 *  Created by Accelerar on 3/17/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;




let ProductCategorySchema = new Schema({
    categoryId: String,
    productId: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  

});
ProductCategorySchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

ProductCategorySchema.virtual('id')
    .get(function() {
        return this._id;
    });

var autoPopulateLead = function(next) {
    this.populate('product');
   
    next();
};




ProductCategorySchema.
    pre('findOne', autoPopulateLead).
pre('find', autoPopulateLead);



module.exports.ProductCategoryModel = mongoose.model('ProductCategory', ProductCategorySchema);