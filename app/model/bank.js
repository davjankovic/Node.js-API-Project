/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let BankSchema = new Schema({
    bankId: String,
    bankName: String,

    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now }
});
BankSchema.pre('update', function(next, done) {
    this.dateModified = Date.now();
    next();
});
BankSchema.pre('save', function(next, done) {
    this.dateModified = Date.now();
    next();
});
BankSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.BankModel = mongoose.model('Bank', BankSchema);