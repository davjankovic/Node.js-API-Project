/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let ComplaintSchema = new Schema({
    cooperId: String,
    message: String,
    subject: String,
    image: String,
    action: String,
    status: String,
    actionParty: String,
    vendorId: String,
    name: String,
    email: String,
    cooperativeId: String,
    actionDate: String,
    complaintId: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },




});
ComplaintSchema.pre('update', function(next, done) {
    this.dateModified = Date.now();
    next();
});
ComplaintSchema.pre('save', function(next, done) {
    this.dateModified = Date.now();
    next();
});
ComplaintSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.ComplaintModel = mongoose.model('Complaint', ComplaintSchema);