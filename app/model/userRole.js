/**
 *  Created by Accelerar on 3/6/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let UserRoleSchema = new Schema({
    cooperator: String,
    vendor: String,
    subVendor: String,
    cooperative: String,
    subCooperative: String,
    cooperAdmin: String,
    subCooperAdmin: String,
    
});
UserRoleSchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

UserRoleSchema.virtual('id')
    .get(function() {
        return this._id;
    });

module.exports.UserRoleModel = mongoose.model('UserRole', UserRoleSchema);