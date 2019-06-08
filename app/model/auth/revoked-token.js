/**
 *  Created by Accelerar on 3/6/2018.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RevokedTokenScheme = new Schema({
    token: String,
    date: { type: Date, default: Date.now }
});
module.exports.RevokedTokenModel = mongoose.model('RevokedToken', RevokedTokenScheme);