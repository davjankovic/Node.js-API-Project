/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let SystemConfigurationSchema = new Schema({
    systemConfigId: String,
    sessionTime: Number,
    status: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
SystemConfigurationSchema.pre('update', function(next, done) {
    this.dateModified = Date.now();
    next();
});
SystemConfigurationSchema.pre('save', function(next, done) {
    this.dateModified = Date.now();
    next();
});
SystemConfigurationSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.SystemConfigurationModel = mongoose.model('SystemConfiguration', SystemConfigurationSchema);