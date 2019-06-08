/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let CooperativeSchema = new Schema({
    cooperativeId: String,
    first_name: String,
    last_name: String,
    status: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
CooperativeSchema.pre('update', function(next, done) {
    this.dateModified = Date.now();
    next();
});
CooperativeSchema.pre('save', function(next, done) {
    this.dateModified = Date.now();
    next();
});
CooperativeSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.CooperativeModel = mongoose.model('Cooperative', CooperativeSchema);