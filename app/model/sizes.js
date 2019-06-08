/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let SizeSchema = new Schema({
    size: Number,
    status: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
SizeSchema.pre('update', function (next, done) {
    this.dateModified = Date.now();
    next();
});
SizeSchema.pre('save', function (next, done) {
    this.dateModified = Date.now();
    next();
});
SizeSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.SizeModel = mongoose.model('Size', SizeSchema);