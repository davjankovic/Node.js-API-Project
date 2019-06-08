/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let VerifyAuthSchema = new Schema({
    userId: String,
    staffId: String,
    cooperativeId: String,
    veryauthtoken: String,
    otp: String,
    status: String,
    authType: String,
    email: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    expires: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
VerifyAuthSchema.pre('update', function(next, done) {
    this.dateModified = Date.now();
    next();
});
VerifyAuthSchema.pre('save', function(next, done) {
    this.dateModified = Date.now();
    next();
});
VerifyAuthSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;
    return obj
};
module.exports.VerifyAuthModel = mongoose.model('VerifyAuth', VerifyAuthSchema);