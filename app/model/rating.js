/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let RatingSchema = new Schema({
    cooperId: String,
    productId: String,
    rating: String,
    comment: String,
    action: String,
    status: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
RatingSchema.pre('update', function (next, done) {
    this.dateModified = Date.now();
    next();
});
RatingSchema.pre('save', function (next, done) {
    this.dateModified = Date.now();
    next();
});
RatingSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.RatingModel = mongoose.model('Rating', RatingSchema);