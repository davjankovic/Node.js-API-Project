/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let ColorSchema = new Schema({
  color: String,
  status: String,
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now }
});
ColorSchema.pre("update", function(next, done) {
  this.dateModified = Date.now();
  next();
});
ColorSchema.pre("save", function(next, done) {
  this.dateModified = Date.now();
  next();
});
ColorSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.__v;

  return obj;
};
module.exports.ColorModel = mongoose.model("Color", ColorSchema);
