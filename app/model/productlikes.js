/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;
const UserModel = require(APP_MODEL_PATH + 'user').UserModel;

let ProductLikeSchema = new Schema({
    productId: String,
    cooperId: String,
    userId: String,
    vendorId: String,
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },

});


ProductLikeSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;
    return obj
};

ProductLikeSchema.virtual('id')
    .get(function() {
        return this._id;
    });

var autoPopulateLead = function(next) {
    this.populate('product');
    next();
};

var autoPopulateUser = function(next) {
    this.populate('user');
    next();
};

ProductLikeSchema.
pre('findOne', autoPopulateLead, autoPopulateUser).
pre('find', autoPopulateLead, autoPopulateUser);


module.exports.ProductLikeModel = mongoose.model('ProductLike', ProductLikeSchema);