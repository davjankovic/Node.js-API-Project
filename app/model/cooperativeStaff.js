/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let CooperativeStaffSchema = new Schema({
    staffId: String,
    cooperativeId: String,
    name: String,
    phone: String,
    email: String,
    address: String,
    levels: String,
    status: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
CooperativeStaffSchema.pre('update', function (next, done) {
    this.dateModified = Date.now();
    next();
});
CooperativeStaffSchema.pre('save', function (next, done) {
    this.dateModified = Date.now();
    next();
});
CooperativeStaffSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.CooperativeStaffModel = mongoose.model('CooperativeStaff', CooperativeStaffSchema);