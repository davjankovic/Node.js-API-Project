/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserModel = require(APP_MODEL_PATH + 'user').UserModel;

let UserAddressSchema = new Schema({
    address: String,
    cooperId: String,
    userId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },

});


UserAddressSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;
    return obj
};

UserAddressSchema.virtual('id')
    .get(function() {
        return this._id;
    });



var autoPopulateUser = function(next) {
    this.populate('user');
    next();
};

UserAddressSchema.
pre('findOne', autoPopulateUser).
pre('find', autoPopulateUser);


module.exports.UserAddressModel = mongoose.model('UserAddress', UserAddressSchema);