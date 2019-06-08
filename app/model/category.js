/**
 *  Created by Accelerar on 3/17/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let CategorySchema = new Schema({
    categoryId: String,
    categoryName: String,
    status: String,
    imagePath: String,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now }


});
CategorySchema.methods.toJSON = function() {
    let obj = this.toObject();
    return obj
};

CategorySchema.virtual('id')
    .get(function() {
        return this._id;
    });

module.exports.CategoryModel = mongoose.model('Category', CategorySchema);