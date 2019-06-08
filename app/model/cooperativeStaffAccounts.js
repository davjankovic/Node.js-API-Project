/**
 *  Created by Accelerar on 3/6/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
const CooperativeModel = require(APP_MODEL_PATH + 'cooperative').CooperativeModel;


let CooperativeStaffAccountsSchema = new Schema({
    cooperativeId: String,
    staffId: String,
    accountType: String,
    accountBalance: Number,
    bookBalance: Number,
    email: String,
    cooperative: { type: mongoose.Schema.Types.ObjectId, ref: "Cooperative" },
});
CooperativeStaffAccountsSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

CooperativeStaffAccountsSchema.virtual('id')
    .get(function() {
        return this._id;
    });




var autoPopulateLead = function(next) {
    this.populate('cooperative');
    next();
};

CooperativeStaffAccountsSchema.
pre('findOne', autoPopulateLead).
pre('find', autoPopulateLead);


module.exports.CooperativeStaffAccountsModel = mongoose.model('CooperativeStaffAccounts', CooperativeStaffAccountsSchema);