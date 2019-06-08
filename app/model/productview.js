/**
 *  Created by Accelerar on 3/17/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;

let ProductViewSchema = new Schema({
    userId: String,
    productId: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
    viewAt: { type: Date },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
});
ProductViewSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

ProductViewSchema.virtual('id')
    .get(function() {
        return this._id;
    });

var autoPopulateLead = function(next) {
    this.populate('product');
    next();
};

ProductViewSchema.
pre('findOne', autoPopulateLead).
pre('find', autoPopulateLead);






module.exports.ProductViewModel = mongoose.model('ProductView', ProductViewSchema);