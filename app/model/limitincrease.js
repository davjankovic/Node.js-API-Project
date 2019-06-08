/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let LimitIncreaseSchema = new Schema({
    cooperativeId: String,
    cooperId: String,
    email: String,
    limit: Number,
    fileAttach: String,
    status: String,
    cooperative: { type: mongoose.Schema.Types.ObjectId, ref: "Cooperative" },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
LimitIncreaseSchema.pre('update', function (next, done) {
    this.dateModified = Date.now();
    next();
});
LimitIncreaseSchema.pre('save', function (next, done) {
    this.dateModified = Date.now();
    next();
});
LimitIncreaseSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.LimitIncreaseModel = mongoose.model('LimitIncrease', LimitIncreaseSchema);