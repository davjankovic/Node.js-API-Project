/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;
let TransactionSchema = new Schema({
    transactId: String,
    cooperId: String,
    cooperativeId: String,
    vendorId: String,
    subVendorId: String,
    staffId: String,
    transactRefNo: String,
    cooperativeTranId: String,
    authorizerPersonId: String,
    authorizationStatus: String,
    transactStatus: String,
    paymentStatus: String,
    unitAmount: Number,
    transAmount: Number,
    amountPaid: Number,
    contactadd: String,
    city: String,
    phoneNo: String,
    description: {
        type: String,
        maxlength: 255
    },
    amountOutstanding: Number,
    productId: String,
    batchId: String,
    productStatus: String,
    paymentType: String,
    paymentTypeSub: String,
    quantity: Number,
    orderStatus: String,
    uploadInvoiceImage: String,
    status: String,
    accountType: String,
    productcategoryId: String,
    transactionDate: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    productcategory: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
TransactionSchema.pre('update', function(next, done) {
    this.dateModified = Date.now();
    next();
});
TransactionSchema.pre('save', function(next, done) {
    this.dateModified = Date.now();
    next();
});
TransactionSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};

var autoPopulateLead = function(next) {
    this.populate('product');
    next();
};
TransactionSchema.
pre('findOne', autoPopulateLead).
pre('find', autoPopulateLead);

module.exports.TransactionModel = mongoose.model('Transaction', TransactionSchema);