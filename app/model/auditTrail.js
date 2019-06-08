/**
 *  Created by Accelerar on 3/6/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let AuditTrailSchema = new Schema({
    cooperId: String,
    ipAddress: String,
    loginTime: String,
    sessionTime: String,
    model: String,
    deviceType: String,
    os: String,
    osVersion: String,
    sdkVersion: String,
    language: String,
    manufacturer: String,
    uuid: String,
    heightDIPs: Number,
    heightPixels: Number,
    scale: Number,
    widthDIPs: Number,
    widthPixels: Number,
    location: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now }


});
AuditTrailSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

AuditTrailSchema.virtual('id')
    .get(function() {
        return this._id;
    });

module.exports.AuditTrailModel = mongoose.model('AuditTrail', AuditTrailSchema);