const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;
const UserModel = require(APP_MODEL_PATH + 'user').UserModel;

let ProductRatingSchema = new Schema({
    productId: String,
    cooperId: String,
    userId: String,
    rate: String,
    vendorId: String,
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },

});


ProductRatingSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;
    return obj
};

ProductRatingSchema.virtual('id')
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

ProductRatingSchema.
pre('findOne', autoPopulateLead, autoPopulateUser).
pre('find', autoPopulateLead, autoPopulateUser);


module.exports.ProductRatingModel = mongoose.model('ProductRating', ProductRatingSchema);