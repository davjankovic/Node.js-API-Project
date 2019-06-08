/**
 *  Created by Accelerar on 3/6/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let SmsConfigSchema = new Schema({
    url: String,
    apiKey: String,
    username: String,
    
});
SmsConfigSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

SmsConfigSchema.virtual('id')
    .get(function() {
        return this._id;
    });

module.exports.SmsConfigModel = mongoose.model('SmsConfig', SmsConfigSchema);