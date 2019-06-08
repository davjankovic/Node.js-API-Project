/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const UserModel = require(APP_MODEL_PATH + 'user').UserModel;
let ProductSchema = new Schema({
    productId: String,
    vendorId: String,
    productName: String,
    productBriefDesc: String,
    productDetailDesc: String,
    productSpec: String,
    productImage: String,
    productBackImage: String,
    productLeftImage: String,
    productRightImage: String,
    brand: String,
    location: String,
    quantity: Number,
    quantitySold: Number,
    price: Number,
    status: String,
    likesCount: Number,
    likes: [{
        cooperId: String,
        userId: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        dateCreated: { type: Date, default: Date.now }
    }],
    rates: [{
        cooperId: String,
        userId: String,
        rate: Number,
        comment: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        dateCreated: { type: Date, default: Date.now },
    }],

    sizes: [String],

    colors: [String],

    tags: [String],
  
    salePrice: Number,
    expires: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },

});


ProductSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;
    return obj
};

ProductSchema.virtual('id')
    .get(function() {
        return this._id;
    });


var autoPopulateUser = function(next) {
    this.populate('user');
    next();
};

ProductSchema.
pre('findOne', autoPopulateUser).
pre('find', autoPopulateUser);

module.exports.ProductModel = mongoose.model('Product', ProductSchema);