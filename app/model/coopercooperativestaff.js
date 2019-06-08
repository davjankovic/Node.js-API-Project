/**
 *  Created by Accelerar on 3/17/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let CooperCooperativeStaffSchema = new Schema({
    cooperativeId: String,
    staffId: String,
    cooperId: String,
    accounttype: String,
    email: String,
    first_name: String,
    cooperative: { type: mongoose.Schema.Types.ObjectId, ref: "Cooperative" },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now }
});
CooperCooperativeStaffSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

CooperCooperativeStaffSchema.virtual('id')
    .get(function() {
        return this._id;
    });

module.exports.CooperCooperativeStaffModel = mongoose.model('CooperCooperativeStaff', CooperCooperativeStaffSchema);