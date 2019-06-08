/**
 *  Created by Accelerar on 3/17/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let AdvertSchema = new Schema({
    ownerName: String,
    email: String,
    phoneNumber: String,
    duration: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
    advertImagePath: String,
    url: String,
    title: String,
    target: String,
    redirectURL: String


});
AdvertSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

AdvertSchema.virtual('id')
    .get(function() {
        return this._id;
    });

module.exports.AdvertModel = mongoose.model('Advert', AdvertSchema);