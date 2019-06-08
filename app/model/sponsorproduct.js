/**
 *  Created by Accelerar on 3/30/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');



let SponsorProductSchema = new Schema({
    categoryId: String,
    productId: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
    ownerName: String,
    phoneNumber: String,
    email: String,
    status: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }


});
SponsorProductSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

SponsorProductSchema.virtual('id')
    .get(function() {
        return this._id;
    });

var autoPopulateLead = function(next) {
    this.populate('product');
    next();
};

SponsorProductSchema.
pre('findOne', autoPopulateLead).
pre('find', autoPopulateLead);





module.exports.SponsorProductModel = mongoose.model('SponsorProduct', SponsorProductSchema);