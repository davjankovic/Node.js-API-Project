/**
 *  Created by Accelerar on 3/6/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
const BankModel = require(APP_MODEL_PATH + 'Bank').BankModel;
let UserSchema = new Schema({
    firstName: String,
    lastName: String,
    salt: {
        type: String,
        required: true
    },
    isActive: { type: Boolean, default: true },
    dateCreated: { type: Date, default: Date.now },
    email: String,
    phoneNo: String,
    cooperId: String,
    staffId: String,
    cooperativeId: String,
    token: String,
    gottoKnowBy: String,
    userTypeId: String,
    transPin: String,
    parentId: String,
    status: String,
    profilePixURL: String,
    rating: String,
    spendingCap: Number,
    resetPasswordToken: String,
    resetPasswordExpires: { type: Date },
    userMode: String,
    accountNumber: String,
    accountName: String,
    bankId: String,
    address: [{
        contactadd: String,
        locationName: String,
        city: String,
        country: String,
        contactadd2: String,
        zipcode: String,
        phoneNo: String,



    }],
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    hashedPassword: {
        type: String,
        required: true,
    },
});
UserSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.hashedPassword;
    delete obj.transPin;
    delete obj.__v;
    delete obj.salt;
    return obj
};

UserSchema.virtual('id')
    .get(function() {
        return this._id;
    });
UserSchema.virtual('password')
    .set(function(password) {
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password, this.salt);
    })
    .get(function() {
        return this.hashedPassword;
    });

UserSchema.methods.encryptPassword = function(password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
};
UserSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password, this.salt) === this.hashedPassword;
};

var autoPopulateLead = function(next) {
    this.populate('bank');
    next();
};

UserSchema.
pre('findOne', autoPopulateLead).
pre('find', autoPopulateLead);

module.exports.UserModel = mongoose.model('User', UserSchema);