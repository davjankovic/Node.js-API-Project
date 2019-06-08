/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let NotificationSchema = new Schema({
   cooperId: String,
    message: String,
    status: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
NotificationSchema.pre('update', function (next, done) {
    this.dateModified = Date.now();
    next();
});
NotificationSchema.pre('save', function (next, done) {
    this.dateModified = Date.now();
    next();
});
NotificationSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.NotificationModel = mongoose.model('Notification', NotificationSchema);