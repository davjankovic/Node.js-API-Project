/**
 *  Created by Accelerar on 3/6/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let CooperativeAPISchema = new Schema({
    cooperativeId: String,
    first_name: String,
    last_name: String,
    status: String,
    apiAuthorization: {
        
            url: String,
            username: String,
            password: String,
            params: [String]
        
    },

    validateMember: {
        url: String
    },

    apiTransaction: {
        description: String,
        email: String,
        value: String,
        url: String
    },

    apiCheckStatus: {
        OrderId: String,
        url: String
    },
    // apiEndPoints: 
    //     {
    //         name: String,
    //         url: String,
    //         urlparams: {
                
    //                 name: String,
    //                 Desc: String
                
    //         }
    //     },
  
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});
CooperativeAPISchema.pre('update', function (next, done) {
    this.dateModified = Date.now();
    next();
});
CooperativeAPISchema.pre('save', function (next, done) {
    this.dateModified = Date.now();
    next();
});
CooperativeAPISchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;

    return obj
};
module.exports.CooperativeAPIModel = mongoose.model('CooperativeAPI', CooperativeAPISchema);



