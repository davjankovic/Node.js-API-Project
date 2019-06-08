/**
 *  Created by Accelerar on 3/6/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let MailConfigSchema = new Schema({
    smtpURL: String,
    username: String,
    password: String,
    type: String,
    port: String

});
MailConfigSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

MailConfigSchema.virtual('id')
    .get(function() {
        return this._id;
    });

module.exports.MailConfigModel = mongoose.model('MailConfig', MailConfigSchema);