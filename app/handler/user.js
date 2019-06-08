/**
 *  Created by Accelerar on 3/6/2018.
 */

'use strict';
const nodemailer = require('nodemailer');
const UserModel = require(APP_MODEL_PATH + 'user').UserModel;
const VerifyAuthModel = require(APP_MODEL_PATH + 'VerifyAuth').VerifyAuthModel;
const CooperativeModel = require(APP_MODEL_PATH + 'cooperative').CooperativeModel;
const CooperCooperativeStaffModel = require(APP_MODEL_PATH + 'coopercooperativestaff').CooperCooperativeStaffModel;
const TransactionModel = require(APP_MODEL_PATH + 'transaction').TransactionModel;
const CooperativeAPIModel = require(APP_MODEL_PATH + 'cooperativeAPI').CooperativeAPIModel;
const MailConfigModel = require(APP_MODEL_PATH + 'mailConfig').MailConfigModel;
const AlreadyExistsError = require(APP_ERROR_PATH + 'already-exists');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const ValidationError = require(APP_ERROR_PATH + 'validation');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');
var generator = require('generate-password');
const UIDGenerator = require('uid-generator');
var url = require('url');
const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
// var Base64 = require('js-base64').Base64;
// var bcrypt = require('bcryptjs');
// var salt = bcrypt.genSaltSync();
var async = require('async');
var crypto = require('crypto');
var multer = require('multer');
var phone = require('phone-regex');
var Client = require('node-rest-client').Client;
var client = new Client();
const path = require("path");
const Email = require("email-templates");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg"
};

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callback(error, "public/productimages");
  },
  filename: function(req, file, callback) {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  }
});


class UserHandler {
    constructor() {
        this._validator = require('validator');
    }

    static get USER_VALIDATION_SCHEME() {
        return {
            'firstName': {
                notEmpty: true,

                errorMessage: 'Invalid First Name'
            },
            'lastName': {
                notEmpty: true,

                errorMessage: 'Invalid First Name'
            },
            'email': {

                errorMessage: "Invalid email provided"
            },
            'password': {
                notEmpty: true,

                errorMessage: 'Invalid Password Format'
            }

        };
    }

    static get USER_EMAIL_VALIDATION_SCHEME() {
        return {

            'email': {
                isEmail: {
                    errorMessage: 'Invalid Email'
                },
                errorMessage: "Invalid email provided"
            }


        };
    }

    static get USER_PASSWORD_VALIDATION_SCHEME() {
        return {

            'oldPassword': {
                notEmpty: true,

                errorMessage: 'Invalid Old Password'
            },
            'newPassword': {
                notEmpty: true,

                errorMessage: 'Invalid New Password'
            },
            'verifyPassword': {
                notEmpty: true,

                errorMessage: 'Invalid Confirm Password'
            },
            'userMode': {
                notEmpty: true,

                errorMessage: 'Invalid User Mode'
            }




        };
    }

    static get VERIFY_COOPERATIVE_STAFF_SCHEMA() {
        return {
            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative Id'
            },
            'staffId': {
                notEmpty: true,
                errorMessage: "Invalid staff Id"
            }
        };
    }

    static get USER_TRANSPIN_VALIDATION_SCHEME() {
        return {

            'userId': {
                notEmpty: true,
                errorMessage: "Invalid User ID provided"
            },
            'pin': {
                notEmpty: true,
                errorMessage: "Invalid Pin provided"
            }


        };
    }




    static get USER_PHONENUMBER_VALIDATION_SCHEME() {
        return {
            'phoneNo': {
                notEmpty: true,

                errorMessage: 'Invalid Phone Number'
            }

        };
    }

    static get USER_PROFILE_VALIDATION_SCHEME() {
        return {
            'firstName': {
                notEmpty: true,

                errorMessage: 'Invalid First Name'
            },
            'lastName': {
                notEmpty: true,

                errorMessage: 'Invalid Last Name'
            },
            'email': {
                notEmpty: true,

                errorMessage: 'Invalid Email'
            },
            'phoneNo': {
                notEmpty: true,

                errorMessage: 'Invalid Phone No'
            },
            'profilePixURL': {
                notEmpty: true,

                errorMessage: 'Invalid Profile Pix'
            }

        };
    }


    static get USER_PIN_VALIDATION_SCHEME() {
        return {
            'pin': {
                notEmpty: true,

                errorMessage: 'Invalid pin'
            },
            'confirmpin': {
                notEmpty: true,

                errorMessage: 'Invalid confirm pin'
            }

        };
    }


    static get USER_ACCOUNT_VALIDATION_SCHEME() {
        return {
            'accountnumber': {
                notEmpty: true,

                errorMessage: 'Invalid Account Number'
            },
            'accountname': {
                notEmpty: true,

                errorMessage: 'Invalid Account Name'
            },
            'bankId': {
                notEmpty: true,

                errorMessage: 'Invalid Bank Id'
            }

        };
    }


    static get USER_CREATEVENDORCOOP_VALIDATION_SCHEME() {
        return {
            'id': {
                notEmpty: true,

                errorMessage: 'Invalid Id'
            },
            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative Id'
            },
            'mode': {
                notEmpty: true,

                errorMessage: 'Invalid Mode'
            },


            'usertype': {
                notEmpty: true,

                errorMessage: 'Invalid User Type'
            }

        };
    }






    getUserInfo(req, userToken, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                let userId = req.params.id;
                if (userToken.id !== req.params.id) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                    return new Promise(function(resolve, reject) {
                        UserModel.findById(userId, function(err, user) {
                            if (user === null) {

                            } else {
                                resolve(user);
                            }
                        });
                    });
                }

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllVendorInfo(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({userTypeId: 'Vendor'}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }



    getAllSubCooperativeInfo(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function (resolve, reject) {
                    UserModel.find({ userTypeId: 'subCooperative', cooperativeId: req.params.id }, function (err, user) {
                        if (user === null) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });
                });


            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }



    getAllCooperatorByLocation(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function (resolve, reject) {
                    let cooperativeId = req.params.id;
                    UserModel.aggregate([

                        {
                            $match: { userTypeId: "Cooperator"}
                         },
                        { $unwind: '$address' },
                        {
                            $group: { "_id": { city: "$address.city" }, number: { "$sum": 1 } } 
                        },

                        {
                            $sort: {'number': -1}
                        }

                    ], function (err, user) {
                        if (user === null) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });
                });


            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllCooperatorByMonth(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function (resolve, reject) {
                    let cooperativeId = req.params.id;

                    UserModel.aggregate([

                        {
                            $match: { 
                                cooperativeId: cooperativeId, userTypeId: "Cooperator"
                            
                         
                            }
                        },

                        {
                            "$project": {
                                "dateCreatedWeek": { "$week": "$dateCreated" },
                                "dateCreatedMonth": { "$month": "$dateCreated" },
                                // "rating": 1
                            }
                        },
                        {
                            "$group": {
                                "_id": "$dateCreatedMonth",
                                // "average": { "$avg": "$rating" },
                                "month": { "$first": "$dateCreatedMonth" },
                                count: {$sum: 1}
                            }
                        },
                        { $sort: { _id: 1 } },
                     
                

                    ], function (err, user) {
                        if (user === null) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });
                });


            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllCooperatorByYear(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function (resolve, reject) {
                    let cooperativeId = req.params.id;
         
                    UserModel.aggregate([

                        {
                            $match: {
                                cooperativeId: cooperativeId, userTypeId: "Cooperator"

                                // "dateCreated": { "$lte": startDate, "$gte": endDate }
                            }
                        },
                        {
                            "$project": {
                                "dateCreatedWeek": { "$week": "$dateCreated" },
                                "dateCreatedMonth": { "$month": "$dateCreated" },
                                "dateCreatedYear": { "$year": "$dateCreated" },
                                // "rating": 1
                            }
                        },
                        {
                            "$group": {
                                "_id": "$dateCreatedYear",
                                // "average": { "$avg": "$rating" },
                                "year": { "$first": "$dateCreatedYear" },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } },


                    ], function (err, user) {
                        if (user === null) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });
                });


            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllCooperatorByWeek(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function (resolve, reject) {
                    let cooperativeId = req.params.id;
           
                    UserModel.aggregate([

                        {
                            $match: {
                                cooperativeId: cooperativeId, userTypeId: "Cooperator",
                            
                                // "dateCreated": { "$eq": getVal }
                            }
                        },

                        {
                            "$project": {
                                "dateCreatedWeek": { "$week": "$dateCreated" },
                                "dateCreatedMonth": { "$month": "$dateCreated" },
                                "dateCreatedYear": { "$year": "$dateCreated" },
                                // "rating": 1
                            }
                        },
                        {
                            "$group": {
                                "_id": "$dateCreatedWeek",
                                // "average": { "$avg": "$rating" },
                                "week": { "$first": "$dateCreatedWeek" },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } },

                        // {
                        //     "$project": {
                        //         "formattedDate": {
                        //             "$dateToString": { "format": "%Y-%m-%d", "date": "$dateCreated" }
                        //         },
                        //         "dateCreatedMonth": { "$week": "$dateCreated" },
                            
                        //     }
                        // },
                       

                    ], function (err, user) {
                        if (user === null) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });
                });


            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

  

    getAllVendorByLocation(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function (resolve, reject) {
                
                    UserModel.aggregate([

                        {
                            $match: {  userTypeId: {$in: ["Vendor", "subVendor"] }}
                        },
                        { $unwind: '$address' },
                        {
                            $group: { "_id": { city: "$address.city"}, number: { "$sum": 1 } }
                        },
                        

                      
                    ], function (err, user) {
                        if (user === null) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });
                });


            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleSubCooperative(req, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function (resolve, reject) {
                    UserModel.findById({ _id: req.params.id }, function (err, user) {
                        if (user === null) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });
                });


            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllCooperatorInfo(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({userTypeId: 'Cooperator', cooperativeId: req.params.id}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllCooperatorInfoByAdmin(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({userTypeId: 'Cooperator'}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllsubAdminInfo(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({userTypeId: 'subAdmin'}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllCooperativeByAdmin(req, callback) {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({userTypeId: 'Cooperative'}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleCooperative(req, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({_id: req.params.id, userTypeId: {$in: ['Cooperative', 'subCooperative']}}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleVendorInfo(req, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({_id: req.params.id, userTypeId: {$in: ['Vendor', 'subVendor']}}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleAdminInfo(req, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({_id: req.params.id, userTypeId: {$in: ['superAdmin', 'subAdmin']}}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleCooperatorInfo(req, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                    return new Promise(function (resolve, reject) {
                        UserModel.find({_id: req.params.id, userTypeId: 'Cooperator'}, function (err, user) {
                            if (user === null) {
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }



    getUserAddressInfo(req, userToken, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                let userId = req.params.id;
                if (userToken.id !== req.params.id) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                    return new Promise(function (resolve, reject) {
                        UserModel.findById(
                          userId,
                          function(err, user) {
                            if (user === null) {
                            } else {
                              resolve(user);
                            }
                          }
                        ).select({
                          "address.contactadd": 1,
                          "address.city": 1,
                          "address.phoneNo": 1,
                          "address.locationName": 1,
                          "address.zipcode": 1,
                          "address.country": 1,
                          "address.contactadd2": 1,
                          _id: 0
                        });
                    });
                }

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    validateVendorInfo(req, callback) {
    //   var data = req.body;
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

              let vendorId = req.query.vendorId;
              
                var query = { cooperId: vendorId, userTypeId: 'Vendor' }
                    return new Promise( function (resolve, reject) {
                        UserModel.findOne(query,
                          function(err, user) {
                            if (err !== null) {
                                reject(err)
                            } else {
                                if(!user){
                                    reject( new NotFoundError('Vendor not found'));
                                } else {
                                    resolve(user);
                                }
                             
                            }
                          }
                        )
                    });
                

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    createNewUser(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(UserHandler.USER_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                var mainPassword = data.password;
                if (data.password === "") {
                    mainPassword = "Welcome"
                }
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new UserModel({
                    firstName: validator.trim(data.firstName),
                    lastName: validator.trim(data.lastName),
                    email: validator.trim(data.email),
                    password: mainPassword,
                    userMode: "Confirm",
                    userTypeId: validator.trim(data.usertype),
                    phoneNo: validator.trim(data.phoneNo)
                });
            })
            .then((user) => {
                return new Promise(function(resolve, reject) {

                    if (data.usertype === "Administrator") {
                        UserModel.find({ userTypeId: data.usertype }, function(err, docs) {
                            if (docs.length) {
                                reject(new AlreadyExistsError("Administrator already exists"));
                            } else {

                                resolve(user);
                            }
                        });
                    } else {
                        UserModel.find({ email: user.email }, function(err, docs) {
                            if (docs.length) {
                                reject(new AlreadyExistsError("User already exists"));
                            } else {


                                resolve(user);
                            }
                        });
                    }

                });
            })
            .then((user) => {
                user.save();
                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }



    forgotPassword(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(UserHandler.USER_EMAIL_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    UserModel.findOne({ email: req.body.email }, function(err, user) {
                        if (user) {
                            resolve(user);
                        } else {
                            reject(new AlreadyExistsError("User does not exists"));
                        }
                    });
                });




            })
            .then((user) => {
                var passToken = Math.floor(Math.random() * 900000) + 100000;

                user.resetPasswordToken = passToken;
                user.resetPasswordExpires = Date.now() + 86400000;


                return user;

            })
            .then((user) => {

                user.save();

                //Send Email and SMS
                console.log(user.phoneNo)
                //config.sms.sendSMS(url, apiKey, username, sender, messagetext, flash, recipients);
            
                // sendSMS("http://api.ebulksms.com:8080/sendsms?", "d49c5155313577e7c17ef59ce87cbace4f63a239", "richomoro@yahoo.com", "c-switch", user.resetPasswordToken, flash, user.phoneNo);
                sendSMS2( user.resetPasswordToken, user.phoneNo)
                // getCheckSum();
                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    forgotPasswordMain(req, res) {
        let data = req.body;
        let validator = this._validator;
        async.waterfall([
            function(done) {
                UserModel.findOne({
                    email: data.email
                }).exec(function(err, user) {
                    if (user) {
                        done(err, user);
                    } else {
                        done('User not found.');
                    }
                });
            },
            function(user, done) {
                // create the random token
                crypto.randomBytes(20, function(err, buffer) {
                    var token = buffer.toString('hex');
                    done(err, user, token);
                });
            },
            function(user, token, done) {
                UserModel.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                    done(err, token, new_user);
                });
            },
            function(token, user, done) {
                var data = {
                    to: user.email,
                    from: email,
                    template: 'forgot-password-email',
                    subject: 'Password help has arrived!',
                    context: {
                        url: 'http://localhost:3000/auth/reset_password?token=' + token,
                        name: user.fullName.split(' ')[0]
                    }
                };

                smtpTransport.sendMail(data, function(err) {
                    if (!err) {
                        return res.json({ message: 'Kindly check your email for further instructions' });
                    } else {
                        return done(err);
                    }
                });
            }
        ], function(err) {
            return res.status(422).json({ message: err });
        });


    }


    /**
     * Reset password
     */

    getPasswordResetToken(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Token provided');
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    UserModel.findOne({ resetPasswordToken: req.params.id }, function(err, user) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!user) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(user);
                            }
                        }
                    })
                });
            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    resetPassword(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid User Id provided').isMongoId();
        req.checkBody(UserHandler.USER_PASSWORD_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                let userId = req.params.id;
                return new Promise(function(resolve, reject) {



                    UserModel.findOne({ _id: userId }, function(err, user) {
                        if (err) {
                            reject(new AlreadyExistsError(err));
                        }
                        if (!user) {
                            reject(new AlreadyExistsError("User not found"));

                        }
                        if (req.body.userMode === "Confirm") {
                            if (!user.checkPassword(req.body.oldPassword)) {
                                reject(new AlreadyExistsError("Old password did not match"));
                            }
                        }

                        resolve(user);
                    });




                });




            })
            .then((user) => {



                if (req.body.newPassword === req.body.verifyPassword) {


                    //user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
                    user.password = req.body.newPassword;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;



                    console.log("User Mode" + req.body.userMode);
                    if (req.body.userMode === "New") {
                        //Sent Token 
                        //user.userMode = "PhoneVerify";
                        user.userMode = "OTPVerify";

                    }


                }


                return user;

            })
            .then((user) => {

                user.save();

                //Send Email and SMS


                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    resetPasswordMain(req, res, next) {
        UserModel.findOne({
            reset_password_token: req.body.token,
            reset_password_expires: {
                $gt: Date.now()
            }
        }).exec(function(err, user) {
            if (!err && user) {
                if (req.body.newPassword === req.body.verifyPassword) {


                    //user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
                    user.password = req.body.newPassword;

                    user.reset_password_token = undefined;
                    user.reset_password_expires = undefined;
                    user.save(function(err) {
                        if (err) {
                            return res.status(422).send({
                                message: err
                            });
                        } else {
                            var data = {
                                to: user.email,
                                from: email,
                                template: 'reset-password-email',
                                subject: 'Password Reset Confirmation',
                                context: {
                                    name: user.fullName.split(' ')[0]
                                }
                            };

                            smtpTransport.sendMail(data, function(err) {
                                if (!err) {
                                    return res.json({ message: 'Password reset' });
                                } else {
                                    return done(err);
                                }
                            });
                        }
                    });
                } else {
                    return res.status(422).send({
                        message: 'Passwords do not match'
                    });
                }
            } else {
                return res.status(400).send({
                    message: 'Password reset token is invalid or has expired.'
                });
            }
        });
    }


    searchUserData(req, callback) {

        let data = req.body;
        //check body for searchValue and skipValue and limitValue
        new Promise(function (resolve, reject) {


            // ProductModel.find({}, function(err, posts) {
            //     if (err !== null) {
            //         reject(err);
            //     } else {
            //         resolve(posts);
            //     }
            // });

            console.log("Search Text " + data.searchValue.toLowerCase());

            // db.users.find({"name": /.*m.*/})

            var query = UserModel.find({ $or: [

                { "firstName": new RegExp('^.*' + data.searchValue.toLowerCase(), "i")},
                { "cooperId": new RegExp('^.*' + data.searchValue.toLowerCase(), "i")}
            ], $and: [{userTypeId: "Cooperator"}] }).select('firstName cooperId staffId phoneNo');
            //var query = ProductModel.find({ "productName": new RegExp('.*' + data.searchValue.toLowerCase(), ".*i") });
            query.skip(data.skipValue).limit(data.limitValue);

            query.exec(function (err, users) {
                // called when the `query.complete` or `query.error` are called
                // internally


                if (err !== null) {
                    reject(err);
                } else {
                    if (!users) {
                        reject(new NotFoundError("Token not found"));
                    } else {
                        console.log("Fetch data " + JSON.stringify(users));
                        resolve(users);
                    }
                }
            });

        })
            .then((users) => {
                callback.onSuccess(users);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    searchUserDataPhone(req, callback) {

        let data = req.body;
        //check body for searchValue and skipValue and limitValue
        new Promise(function (resolve, reject) {


            // ProductModel.find({}, function(err, posts) {
            //     if (err !== null) {
            //         reject(err);
            //     } else {
            //         resolve(posts);
            //     }
            // });

            // console.log("Search Text " + data.searchValue.toLowerCase());

            // db.users.find({"name": /.*m.*/})
            var phoneNo = req.query.searchPhone;
            console.log('this is phone' + phoneNo)
            var userPhone = phone({ exact: true }).test(phoneNo)
            if (!userPhone) {

                reject(new NotFoundError("Wrong Phone Number"));
            } else {
            var query = UserModel.findOne({ $or: [

                { "phoneNo": new RegExp('^.*' + req.query.searchPhone.toLowerCase(), "i")},
            ], $and: [{userTypeId: 'Cooperator'}] }).select('firstName cooperId staffId');
            //var query = ProductModel.find({ "productName": new RegExp('.*' + data.searchValue.toLowerCase(), ".*i") });
            query.skip(data.skipValue).limit(data.limitValue);

            query.exec(function (err, users) {
                // called when the `query.complete` or `query.error` are called
                // internally


                if (err !== null) {
                    reject(err);
                } else {
                    if (users === null) {
                      
                        reject(new NotFoundError("user not found"));
                    } else {
                        console.log("Fetch data " + JSON.stringify(users));
                        resolve(users);
                    }
                }
            });
        }
        })
            .then((users) => {
                callback.onSuccess(users);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    ussdDeductCooperator(req, callback) {

        let data = req.body;
        let dataApi = req.body;
        //check body for searchValue and skipValue and limitValue
        new Promise(function (resolve, reject) {


            // ProductModel.find({}, function(err, posts) {
            //     if (err !== null) {
            //         reject(err);
            //     } else {
            //         resolve(posts);
            //     }
            // });

            console.log("Search Text " + req.query.searchPhone.toLowerCase());

            // db.users.find({"name": /.*m.*/})
            var phoneNo = req.query.searchPhone;
            var userPhone = phone({ exact: true }).test(phoneNo)
            if (!userPhone) {

                reject(new NotFoundError("Wrong Phone Number"));
            } else {
            var query = UserModel.find({ $or: [

                { "phoneNo": new RegExp('^.*' + req.query.searchPhone.toLowerCase(), "i")},
            ], $and: [{userTypeId: "Cooperator"}] }).select('firstName transPin cooperId');
            //var query = ProductModel.find({ "productName": new RegExp('.*' + data.searchValue.toLowerCase(), ".*i") });
            query.skip(data.skipValue).limit(data.limitValue);

            query.exec(function (err, users) {
                // called when the `query.complete` or `query.error` are called
                // internally


                if (err !== null) {
                    reject(err);
                } else {
                    if (!users) {
                        reject(new NotFoundError("Token not found"));
                    } else {
                        console.log("Fetch data " + JSON.stringify(users));

                        UserModel.findOne({ staffId: req.query.staffId }, function (err, user) {

                            if (err !== null) {
                                reject(error);


                            } else {
                                if (!user) {
                                    reject(new NotFoundError("Account not found"));
                                } else {



                                    // console.log('yeah transaction');

                                    CooperativeAPIModel.findOne({ cooperativeId: req.query.cooperativeId }, function (err, cooperative) {
                                        // console.log('yeah transaction 1' + cooperative);
                                        if (err !== null) {
                                            reject(err);
                                        } else {
                                            if (cooperative === null) {
                                                reject(new NotFoundError("Cooperative not found"));
                                                // console.log('cooperative is null');
                                            } else {
                                                var args = {
                                                    data: { grant_type: 'password', username: cooperative.apiAuthorization.username, password: cooperative.apiAuthorization.password },
                                                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                                                };
                                                let urlapi = cooperative.apiAuthorization.url;

                                                client.post("" + urlapi + "", args, function (data, response) {
                                                    // parsed response body as js object
                                                    console.log("Data from Cooplag " + JSON.stringify(data));
                                                    // raw response
                                                    console.log('Response from Cooplag' + response);


                                                    if (data !== null) {


                                                        // let descriptionMessage = ` Transaction from CooperSwitch: Vendor ${vendor.firstName} ${vendor.lastName},  `;
                                                        // console.log(descriptionMessage)
                                                        var args = {
                                                            data: { description: '', email: user.staffId, value: req.query.amount, tenor: req.query.tenor },
                                                            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                                                        };
                                                        let urlapi = cooperative.apiTransaction.url;

                                                        client.post("" + urlapi + "", args, function (data, response) {
                                                            // parsed response body as js object
                                                            console.log("Data from Cooplag " + JSON.stringify(data));
                                                            // raw response
                                                            console.log('Response from Cooplag' + response);

                                                           


                                                                UserModel.findOne({ cooperId: req.query.vendorId }, function (err, vendor) {

                                                                    if (err !== null) {
                                                                        reject(error);


                                                                    } else {
                                                                        if (!vendor) {
                                                                            reject(new NotFoundError("vendor not found"));
                                                                        } else {
                                                                          

                                                                            if (data.Status === 'Submitted') {
                                                                                console.log('this is email' + vendor.email)
                                                                                resolve(new TransactionModel({
                                                                                    cooperativeId: validator.trim(req.query.cooperativeId),
                                                                                    cooperId: validator.trim(user.cooperId),
                                                                                    vendorId: validator.trim(req.query.vendorId),
                                                                                    batchId: Math.floor(Math.random() * 9000000000) + 1000000000,
                                                                                    transAmount: validator.trim(req.query.amount),
                                                                                    description: validator.trim(req.query.description),
                                                                                    staffId: validator.trim(req.query.staffId),
                                                                                    phoneNo: validator.trim(req.query.searchPhone),
                                                                                    orderStatus: "USSD",
                                                                                    status: "Success",
                                                                                    transactionDate: Date.now()
                                                                                }));

                                                                            } else {
                                                                                reject(new Error(data.Message));
                                                                            }
                                                                            // sendEmail("www.cooperswitch.com", vendor.email, element.products, 'Vendor')
                                                                        }

                                                                    }

                                                                })


                                                      
                                                            // console.log(dataApi.description)
                                                            // console.log(dataApi.staffId)
                                                            // sendEmail("www.cooperswitch.com", dataApi.staffId, dataApi.description, "Cooperator");
                                                            //    console.log(dataApi.vendors)


                                                          
                                                            // raw response
                                                            // console.log('Response from Cooplag' + response);
                                                        }).on('error', function (err) {
                                                            console.log('something went wrong on the request');
                                                        });

                                                        // handling client error events
                                                        client.on('error', function (err) {
                                                            console.error('Something went wrong on the client', err);
                                                        });

                                                    }

                                                }).on('error', function (err) {
                                                    console.log('something went wrong on the request');
                                                });

                                                // handling client error events
                                                client.on('error', function (err) {
                                                    console.error('Something went wrong on the client', err);
                                                });

                                                // resolve(cooperative);
                                            }
                                        }

                                    })

                                }
                            }
                        })

                        // resolve(users);
                    }
                }
            });
        }
        })
            .then((users) => {
                users.save();
                callback.onSuccess(users);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    editPhoneNumber(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid User Id provided').isMongoId();
        req.checkBody(UserHandler.USER_PHONENUMBER_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;

                return new Promise(function(resolve, reject) {
                    UserModel.findById(userId, function(err, user) {
                        if (user) {
                            resolve(user);
                        } else {
                            reject(new AlreadyExistsError("User does not exists"));
                        }
                    });
                });




            })
            .then((user) => {


                //user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
                user.phoneNo = req.body.phoneNo;
                user.userMode = "OTPVerify";


                return user;

            })
            .then((user) => {

                user.save();

                //Send Email and SMS


                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }



    changePin(req, userToken, callback) {
        let data = req.body;
        let validator = this._validator;
      

        console.log("User Id Transaction Pin " + req.params.id);
        req.checkParams('id', 'Invalid User Id provided');
        req.checkBody(UserHandler.USER_PIN_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;
              
                if (userToken.id !== req.params.id) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                return new Promise(function(resolve, reject) {
                    UserModel.findById(userId, function(err, user) {
                        if (user) {
                            if (data.pin !== data.confirmpin) {
                                reject(new AlreadyExistsError("Pin did not match"));

                            } else if (data.oldPin !== user.transPin) {

                                reject(new AlreadyExistsError("Old transpin does not match"));

                            }else{
                                resolve(user);
                            }
                           
                        } else {
                            reject(new AlreadyExistsError("User does not exists"));
                        }
                    });
                });

            }
            

            })
            .then((user) => {


                //user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);

                if (data.pin == data.confirmpin) {
                    user.transPin = req.body.pin;

                }



                return user;

            })
            .then((user) => {

                user.save();

                //Send Email and SMS


                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
        
    }



    changeTransPin(req, callback) {
        let data = req.body;
        let validator = this._validator;
        console.log("User Id Transaction Pin " + req.params.id);
        req.checkParams('id', 'Invalid User Id provided');
        req.checkBody(UserHandler.USER_PIN_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;



                return new Promise(function (resolve, reject) {
                    UserModel.findById(userId, function (err, user) {
                        if (user) {
                            if (data.pin != data.confirmpin) {
                                reject(new AlreadyExistsError("Pin did not match"));

                            }




                            resolve(user);
                        } else {
                            reject(new AlreadyExistsError("User does not exists"));
                        }
                    });
                });




            })
            .then((user) => {


                //user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);

                if (data.pin == data.confirmpin) {
                    user.transPin = req.body.pin;

                    return new Promise(function(resolve, reject) {
                        CooperativeModel.findOne({ cooperativeId: user.cooperativeId }, function (err, cooperative) {
                            if (err !== null) {
                                reject(err);
                            } else {
                                if (!cooperative) {
                                    reject(new NotFoundError("Cooperative not found"));
                                } else {
                                 
                                    // resolve(cooperative);
                                    resolve( new CooperCooperativeStaffModel({

                                        cooperativeId: validator.trim(user.cooperativeId),
                                        staffId: validator.trim(user.staffId),
                                        cooperId: validator.trim(user.cooperId),
                                        first_name: cooperative.first_name

                                    }));

                                    sendCooperativeEmail("www.cooperswitch.com",  user.staffId);

                                }
                            }
                        });

                    })

                   

                }



                return user;

            })
            .then((user) => {

                user.save();

                //Send Email and SMS


                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    setAccountDetails(req, userToken, callback) {
        let data = req.body;
        let validator = this._validator;
      
        console.log("User Id Transaction Pin " + req.params.id);
        req.checkParams('id', 'Invalid User Id provided');
        req.checkBody(UserHandler.USER_ACCOUNT_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;

                if (userToken.id !== req.params.id) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {

                return new Promise(function(resolve, reject) {
                    UserModel.findById(userId, function(err, user) {
                        if (user) {
                            if (data.pin != data.confirmpin) {
                                reject(new AlreadyExistsError("Pin did not match"));

                            }
                            resolve(user);
                        } else {
                            reject(new AlreadyExistsError("User does not exists"));
                        }
                    });
                });

            }


            })
            .then((user) => {


                //user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);



                user.accountNumber = data.accountNumber;
                user.accountName = data.accountName;
                user.bankId = data.bankId;
                user.bank = data.bankId;
                user.userMode = "Confirm";


                return user;

            })
            .then((user) => {

                user.save();

                //Send Email and SMS


                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
        
    }


    editProfile(req, userToken, callback, res) {

      
        console.log("Reaching File Upload");

        var filenameConcat = "";


        var Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "public/profileimages");
            },
            filename: function (req, file, callback) {
              
                filenameConcat = file.fieldname + "_" + Date.now() + "_" + file.originalname;
                callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            }
        });

        var upload = multer({ storage: Storage }).single("profilePixURL"); //Field name and max count
        var _that = this;
        upload(req, res, function (err) {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }

       
        let data = req.body;
        // let validator = this._validator;
        req.checkParams('id', 'Invalid User Id provided').isMongoId();
      
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;
                if (userToken.id !== req.params.id) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                return new Promise(function(resolve, reject) {
                    UserModel.findById(userId, function(err, user) {
                        if (user) {
                            resolve(user);
                        } else {
                            reject(new AlreadyExistsError("User does not exists"));
                        }
                    });
                });
            }



            })
            .then((user) => {


                const url = req.protocol + '://' + req.get('host');
                //user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);

              
                    console.log("this is the file " + data.firstName);
                
              
               if(data.firstName !== ''){
                  user.firstName = data.firstName;
              }
               if (data.phoneNo !== '') {
                    user.phoneNo = data.phoneNo;
                }  
              if (data.lastName !== '') {
                  user.lastName = data.lastName;
              }
              if (data.email !== '') {
                  user.email = data.email;
              }
             if (filenameConcat !== ''){
              user.profilePixURL = url + "/profileimages/" + filenameConcat;
             }
                return user;

            })
            .then((user) => {

                user.save();

                //Send Email and SMS


                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
        });

    
        }
    

    addUserAddress(req, userToken, callback) {

            let data = req.body;
            // let validator = this._validator;
   
            req.checkParams('id', 'Invalid User Id provided').isMongoId();

            req.getValidationResult()
                .then(function (result) {
                    if (!result.isEmpty()) {
                        let errorMessages = result.array().map(function (elem) {
                            return elem.msg;
                        });
                        throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                    }
                    let userId = req.params.id;
                    if (userToken.id !== req.params.id) {
                        throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                    } else {
                    return new Promise(function (resolve, reject) {
                        UserModel.findById(userId, function (err, user) {
                            if (user) {
                                resolve(user);
                            } else {
                                reject(new AlreadyExistsError("User does not exists"));
                            }
                        });
                    });

                }


                })
                .then((user) => {
                    user.address.push({
                      city: req.body.city,
                      phoneNo: req.body.phoneNo,
                      country: req.body.country,
                      zipcode: req.body.zipcode,
                      locationName: req.body.locationName,
                      contactadd2: req.body.contactadd2,
                      contactadd: req.body.contactadd
                    });

                    return user;

                })
                .then((user) => {

                    user.save();

                    //Send Email and SMS


                    return user;
                })
                .then((saved) => {
                    callback.onSuccess(saved);
                })
                .catch((error) => {
                    callback.onError(error);
                });
            
    }

    getVerifyCooperativeStaff(req, callback) {
        let data = req.body;
        let dataAPI = req.body;

        var passwordgen;
        var passToken;
        // req.checkParams('id', 'Invalid Staff Id provided');
        // req.checkParams('cooperativeId', 'Invalid CooperativeId provided');
        // req.checkParams('mode', 'Invalid Operative Mode provided');
        // req.checkParams('name', 'Invalid name provided');
        // req.checkParams('usertype', 'Invalid User Type provided');


        let validator = this._validator;
        req.checkBody(UserHandler.USER_CREATEVENDORCOOP_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {


                    passwordgen = generator.generate({
                        length: 10,
                        numbers: true
                    });

                    //Cooper ID
                    var cooperId = Math.floor(Math.random() * 900000000) + 100000000;

                    passToken = Math.floor(Math.random() * 900000) + 100000;

                    if (data.usertype === "cooperator") {

                        console.log("Reaching Cooperator Registration");
                        CooperativeAPIModel.findOne({ cooperativeId: data.cooperativeId }, function(err, cooperative) {
                      
                            if (err !== null) {
                                reject(err);
                            } else {
                                if (!cooperative) {
                                    reject(new NotFoundError("Staff not found"));
                                } else {
                                    var args = {
                                        data: { grant_type: 'password', username: cooperative.apiAuthorization.username, password: cooperative.apiAuthorization.password },
                                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                                    };
                                    let urlapi = cooperative.apiAuthorization.url;

                                    client.post(""+ urlapi + "" , args, function (data, response) {
                                        // parsed response body as js object
                                        console.log("Data from Cooplag " + JSON.stringify(data));
                                        // raw response
                                        console.log('Response from Cooplag' + response);


                                        if (data !== null) {
                                            var args = {

                                                headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                                            };
                                          
                                            let validUrl = cooperative.validateMember.url;
                                             
                                            client.get("" + validUrl + "" + dataAPI.id, args, function (data, response) {
                                                // parsed response body as js object
                                                console.log("Member Data from Cooplag " + JSON.stringify(data));

                                                if (data.Message === 'Member Account is Valid') {

                                                    resolve(new UserModel({
                                                        firstName: "coop",
                                                        lastName: "coop",
                                                        phoneNo: dataAPI.phoneNo,
                                                        email: dataAPI.id,
                                                        staffId: dataAPI.id,
                                                        cooperativeId: dataAPI.cooperativeId,
                                                        password: passwordgen,
                                                        cooperId: cooperId,
                                                        resetPasswordToken: passToken,
                                                        resetPasswordExpires: Date.now() + 86400000,
                                                        userMode: "New",
                                                        userTypeId: "Cooperator",
                                                    }));
                                                } else {
                                                    reject(new NotFoundError("Staff not found"));
                                                }
                                                // raw response
                                                console.log('Response from Cooplag' + response);
                                            }).on('error', function (err) {
                                                console.log('something went wrong on the request');
                                            });

                                            // handling client error events
                                            client.on('error', function (err) {
                                                console.error('Something went wrong on the client', err);
                                            });
                                        }

                                    }).on('error', function (err) {
                                        console.log('something went wrong on the request');
                                    });

                                    // handling client error events
                                    client.on('error', function (err) {
                                        console.error('Something went wrong on the client', err);
                                    });

                                    // resolve(cooperative);
                                }
                            }
                            
                        })
                       
                       


                    }
                    
                    else if (data.usertype === "subVendor") {
                            console.log('this is the sub vendor email: ' + data.id)
                        console.log("Reaching Sub Vendor Registration");

                        resolve(new UserModel({
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.id,
                            parentId: data.vendorId,
                            address: data.address,
                            userTypeId: "subVendor",
                            password: passwordgen,
                            cooperId: cooperId,
                            resetPasswordToken: passToken,
                            resetPasswordExpires: Date.now() + 86400000,
                            userMode: "Confirm"

                        }));



                    }
                     else if (data.usertype === "cooperative") {

                        console.log("Reaching Cooperative Registration");

                        resolve(new UserModel({
                            firstName: data.firstName,
                            lastName: data.firstName,
                            email: data.id,
                            address: data.address,
                            userTypeId: "Cooperative",
                            password: passwordgen,
                            cooperativeId: data.cooperativeId,
                            cooperId: cooperId,
                            resetPasswordToken: passToken,
                            resetPasswordExpires: Date.now() + 86400000,
                            userMode: "Confirm"

                        }));



                    }
                    else if (data.usertype === "subCooperative") {

                        console.log("Reaching Sub Cooperative Registration");

                        resolve(new UserModel({
                            firstName: data.firstName,
                            lastName: data.firstName,
                            email: data.id,
                            address: data.address,
                            parentId: data.adminId,
                            cooperativeId: data.cooperativeId,
                            userTypeId: "subCooperative",
                            password: passwordgen,
                            cooperId: cooperId,
                            resetPasswordToken: passToken,
                            resetPasswordExpires: Date.now() + 86400000,
                            userMode: "Confirm"

                        }));



                    }
                    else if (data.usertype === "superAdmin") {

                        console.log("Reaching Super Admin Registration");

                        resolve(new UserModel({
                            firstName: data.firstName,
                            lastName: data.firstName,
                            email: data.id,
                            address: data.address,
                            userTypeId: "superAdmin",
                            password: passwordgen,
                            cooperId: cooperId,
                            resetPasswordToken: passToken,
                            resetPasswordExpires: Date.now() + 86400000,
                            userMode: "Confirm"

                        }));



                    }
                    else if (data.usertype === "subAdmin") {

                        console.log("Reaching Sub Admin Registration");

                        resolve(new UserModel({
                            firstName: data.firstName,
                            lastName: data.firstName,
                            email: data.id,
                            address: data.address,
                            parentId: data.adminId,
                            userTypeId: "subAdmin",
                            password: passwordgen,
                            cooperId: cooperId,
                            resetPasswordToken: passToken,
                            resetPasswordExpires: Date.now() + 86400000,
                            userMode: "Confirm"

                        }));



                    }
                     else {

                        console.log("Reaching Vendor Registration");

                        resolve(new UserModel({
                            firstName: data.name,
                            lastName: data.name,
                            phoneNo: data.phoneNo,
                            email: data.id,
                            userTypeId: "Vendor",
                            password: passwordgen,
                            cooperId: cooperId,
                            resetPasswordToken: passToken,
                            resetPasswordExpires: Date.now() + 86400000,
                            userMode: "New"

                        }));
                    }



                });
            }).then((user) => {
                return new Promise(function(resolve, reject) {
                    UserModel.find({ email: user.email }, function(err, docs) {
                        if (docs.length) {
                            // if (req.params.mode === "New") {
                            //     reject(new AlreadyExistsError("User already exists"));
                            // } else {
                            //     resolve(user);
                            // }
                            reject(new AlreadyExistsError("User already exists"));
                        } else {
                            resolve(user);
                        }
                    });
                });
            })
            .then((user) => {

                console.log("Mode " + data.mode);
                if (data.mode === "New") {
                    console.log("User " + JSON.stringify(user));
                    user.save();

                    //Also Add to CooperStaffCooperative Table

                    //send Mail
                    console.log("Password " + passwordgen);
                    //Send Email
                    sendEmail("www.cooperswitch.com", user.email, passwordgen, user.cooperId, user.firstName, passToken);
                    //sendEmailTemporaryPassword(user.email, passwordgen, user.cooperId, user.firstName);

                    //sendSMS("http://api.ebulksms.com:8080/sendsms?", "d49c5155313577e7c17ef59ce87cbace4f63a239", "richomoro@yahoo.com", "c-switch", passToken, flash, user.phoneNo);

                    //Send SMS with only verification Token
                } 

                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }





    verifyUserandCreateAccount2(req, callback) {
        let data = req.body;
        let validator = this._validator;

        var passwordgen;
        var passToken;

        req.checkParams('id', 'Invalid Token provided');
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function(resolve, reject) {
                    VerifyAuthModel.findOne({ veryauthtoken: req.params.id }, function(err, verifyauth) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!verifyauth) {
                                reject(new NotFoundError("Token not found"));
                            } else {


                                passwordgen = generator.generate({
                                    length: 10,
                                    numbers: true
                                });

                                //Cooper ID
                                var cooperId = Math.floor(Math.random() * 900000000) + 100000000;
                                // return new UserModel({
                                //     firstName: validator.trim(verifyauth.firstName),
                                //     lastName: validator.trim(verifyauth.lastName),
                                //     phoneNo: validator.trim(verifyauth.phoneNumber),
                                //     email: validator.trim(verifyauth.email),
                                //     password: passwordgen,
                                //     cooperId: cooperId,
                                //     userMode: "New"
                                // });

                                passToken = Math.floor(Math.random() * 900000) + 100000;



                                resolve(new UserModel({
                                    firstName: validator.trim(verifyauth.firstName),
                                    lastName: validator.trim(verifyauth.lastName),
                                    phoneNo: validator.trim(verifyauth.phoneNumber),
                                    email: validator.trim(verifyauth.email),
                                    password: passwordgen,
                                    cooperId: cooperId,
                                    resetPasswordToken: passToken,
                                    resetPasswordExpires: Date.now() + 86400000,
                                    userMode: "New"
                                }));
                            }
                        }
                    });
                });


                // return new UserModel({
                //     firstName: validator.trim(data.firstName),
                //     lastName: validator.trim(data.lastName),
                //     email: validator.trim(data.email),
                //     password: validator.trim(data.password),
                //     userMode: "New"
                // });
            })
            .then((user) => {
                return new Promise(function(resolve, reject) {
                    UserModel.find({ email: user.email }, function(err, docs) {
                        if (docs.length) {
                            reject(new AlreadyExistsError("User already exists"));
                        } else {
                            resolve(user);
                        }
                    });
                });
            })
            .then((user) => {

                console.log("User " + JSON.stringify(user));
                user.save();

                //send Mail
                console.log("Password " + passwordgen);
                //Send Email
                sendEmail("www.cooperswitch.com", user.email, passwordgen, user.cooperId, user.firstName, passToken);
                sendSMS("http://api.ebulksms.com:8080/sendsms?", "d49c5155313577e7c17ef59ce87cbace4f63a239", "richomoro@yahoo.com", "c-switch", passToken, flash, user.phoneNo);

                //Send SMS with only verification Token

                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    verifyUserandCreateAccount(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid Token provided');
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    // VerifyAuthModel by Token 

                    VerifyAuthModel.findOne({ veryauthtoken: req.params.id }, function(err, verifyauth) {
                            if (err !== null) {
                                reject(err);
                            } else {
                                if (!verifyauth) {
                                    reject(new NotFoundError("Token not found"));
                                } else {
                                    resolve(verifyauth);
                                }
                            }
                        }).then((verifyauth) => {

                            var passwordgen = generator.generate({
                                length: 10,
                                numbers: true
                            });

                            //Cooper ID
                            var cooperId = Math.floor(Math.random() * 900000000) + 100000000;
                            return new UserModel({
                                firstName: validator.trim(verifyauth.firstName),
                                lastName: validator.trim(verifyauth.lastName),
                                phoneNo: validator.trim(verifyauth.phoneNumber),
                                email: validator.trim(verifyauth.email),
                                password: passwordgen,
                                cooperId: cooperId,
                                userMode: "New"
                            });


                        }).then((user) => {
                            return new Promise(function(resolve, reject) {
                                UserModel.find({ email: user.email }, function(err, docs) {
                                    if (docs.length) {
                                        reject(new AlreadyExistsError("User already exists"));
                                    } else {
                                        resolve(user);
                                    }
                                });
                            });
                        }).then((user) => {
                            user.save();


                            //send Email 
                            UserHandler.sendEmail("www.cooperswitch.cm", user.email, passwordgen, user.cooperId, user.firstName)
                            return user;
                        })
                        .then((saved) => {
                            callback.onSuccess(saved);
                        })
                        .catch((error) => {
                            callback.onError(error);
                        });


                });
            })
            .then((post) => {
                callback.onSuccess(post);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }




    checkTransPin(req, callback) {
        let data = req.body;

        req.checkBody(UserHandler.USER_TRANSPIN_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    UserModel.findOne({ _id: data.userId }, function(err, user) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!user) {
                                reject(new NotFoundError("User not found"));
                            } else {

                                if (user.transPin !== data.pin) {
                                    reject(new NotFoundError("Incorrect Pin"));
                                }

                                resolve(user);


                            }
                        }
                    })
                });
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    ussdCheckTransPin(req, callback) {
        let data = req.body;

        // req.checkBody(UserHandler.USER_TRANSPIN_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                console.log(req.query.userId, req.query.pin)
                return new Promise(function(resolve, reject) {
                    UserModel.findOne({ _id: req.query.userId }, function(err, user) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!user) {
                                reject(new NotFoundError("User not found"));
                            } else {

                                if (user.transPin !== req.query.pin) {
                                    reject(new NotFoundError("Incorrect Pin"));
                                }

                                resolve(user);


                            }
                        }
                    })
                });
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllUsersByCooperative(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
            UserModel.find({cooperativeId: req.params.id}).count( function (err, users) {
                if (err !== null) {
                    reject(err);
                } else {

                    resolve(users);
                }
            });
            
        })
            .then((users) => {
                callback.onSuccess(users);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllUsers(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                UserModel.find({}, function(err, users) {
                    if (err !== null) {
                        reject(err);
                    } else {

                        resolve(users);
                    }
                });
            })
            .then((users) => {
                callback.onSuccess(users);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllNewUsers(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                UserModel.aggregate([
                   { 
                        $sort: { dateCreated: -1 }
                }

                ], function(err, users) {
                    if (err !== null) {
                        reject(err);
                    } else {

                        resolve(users);
                    }
                })
            })
            .then((users) => {
                callback.onSuccess(users);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    forgot(req, callback) {
       
                new Promise(function (resolve, reject) {   
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      
      UserModel.findOne({ email: req.body.email }, function(err, user) {
          if(err !== null) {
              reject(err);
          } else {
            if(!user) {
               
                reject(new Error('No account with that email address exists.'))
              

            } else {
 
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {

                    resolve('Email has been sent to this ' + user.email)
                    done(err, token, user);

                });
            }

          }
       
      });
   
    },
    function(token, user, done) {
   
    //nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //     name: process.env.MAIL_NAME,
    //     host: process.env.MAIL_HOST,
    //     port: process.env.MAIL_PORT,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: process.env.MAIL_USERNAME, // generated ethereal user
    //         pass: process.env.MAIL_PASSWORD // generated ethereal password
    //     },
    //     tls: {
    //         rejectUnauthorized: false
    //     }
    // });
    //     //'http://' + req.headers.host + '/v1/users/reset/' + token + '\n\n' +
    // // setup email data with unicode symbols
    // let host = 'http://13.126.203.222:3010/kyc/set-new-password/'
    // let mailOptions = {
    //     from: '"Cooper Switch" <info@cooperswitch.com>', // sender address
    //     to: `${user.email}`, // list of receivers
    //     subject: 'Forgot Password', // Subject line

    //     html: 'You are receiving this because you have requested the reset password for your account.\n\n' +
    //       'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    //         host + token + '\n\n' +
    //       'If you did not request this, please ignore this email and your password will remain unchanged.\n' // html body
    // };

    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    //     // Preview only available when sending through an Ethereal account
    //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    //     done(err, 'done');
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // });
    // });
        let urlHost = 'http://13.126.203.222:3010/kyc/set-new-password/' + token;

        var templateDir = path.join(__dirname, '../../', 'templates', 'forgotPassword')

        const email = new Email({
            views: { root: templateDir },

            send: true,
            transport: {
                name: process.env.MAIL_NAME,
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.MAIL_USERNAME, // generated ethereal user
                    pass: process.env.MAIL_PASSWORD // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            },


        });
       
        email.send({
            template: path.join(__dirname, '../../', 'templates', 'forgotPassword'),
            message: {
                to: user.email,
                from: '"Cooper Switch" <info@cooperswitch.com>',
            },

            locals: {
                emailaddress: user.email,
                urlHost: urlHost,
                firstName: user.firstName

            }
        })
            .then(console.log)
            .catch(console.error);



        resolve(user)
    }
    
  ], function(err) {
    if (err) return next(err);
   
  });
})  
 .then((users) => {
    callback.onSuccess(users);
    })
    .catch((error) => {
   callback.onError(error);
    });
}
  

    reset(req, callback) {
            var data = req.body;
        new Promise(function(resolve, reject) {
        async.waterfall([
            function (done) {

            
                UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        if (!user) {

                            reject(new Error('No token provided.'))


                        } else {

                            if(data.password === data.confirmPassword) {

                                user.password = req.body.password;
                                user.resetPasswordToken = undefined;
                                user.resetPasswordExpires = undefined;

                                user.save(function (err) {

                                    resolve('password reset successful')
                                    done(err, user);

                                });

                            } else {
                                reject(new Error('Passwords do not match.'))
                            }

                 
                }
            }
                });
            
          

            },
            function (user, done) {
              
                  
    //nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
//    let transporter = nodemailer.createTransport({
//         name: process.env.MAIL_NAME,
//         host: process.env.MAIL_HOST,
//         port: process.env.MAIL_PORT,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: process.env.MAIL_USERNAME, // generated ethereal user
//             pass: process.env.MAIL_PASSWORD // generated ethereal password
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });


//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"Cooper Switch" <info@cooperswitch.com>', // sender address
//         to: `${user.email}`, // list of receivers
//         subject: 'Reset Password', // Subject line

//         html: 'Hello,\n\n' +
//             'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//         done(err, 'done');
//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
//     // });


         

                var templateDir = path.join(__dirname, '../../', 'templates', 'resetPassword')

                const email = new Email({
                    views: { root: templateDir },

                    send: true,
                    transport: {
                        name: process.env.MAIL_NAME,
                        host: process.env.MAIL_HOST,
                        port: process.env.MAIL_PORT,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: process.env.MAIL_USERNAME, // generated ethereal user
                            pass: process.env.MAIL_PASSWORD // generated ethereal password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    },


                });

                email.send({
                    template: path.join(__dirname, '../../', 'templates', 'resetPassword'),
                    message: {
                        to: user.email,
                        from: '"Cooper Switch" <info@cooperswitch.com>',
                    },

                    locals: {
                        emailaddress: user.email,
                        firstName: user.firstName

                    }
                })
                    .then(console.log)
                    .catch(console.error);



            }
        ], function (err) {
            // res.redirect('/');
        });
        }).then((users) => {
            callback.onSuccess(users);
        })
            .catch((error) => {
                callback.onError(error);
            });
    };
    
//      sendMesssage(req, callback) {

//         let data = req.body 
//          let validator = this._validator;
//          req
//              .getValidationResult()
//              .then(function (result) {
//                  if (!result.isEmpty()) {
//                      let errorMessages = result.array().map(function (elem) {
//                          return elem.msg;
//                      });
//                      throw new ValidationError(
//                          "There are validation errors: " + errorMessages.join(" && ")
//                      );
//                  }
//                 //  + data.loginId + data.key + data.msisdn + data.senderId + data.messageBody + data.transactionRef
//                  var transactionRef = uidgen.generateSync();
//                  console.log(transactionRef)
//     let privateKey = 'XY1t9Y159hWJaETD';
//                  let loginId = '38457'
//         console.log(data.loginId)

//                  let concatString = loginId +"|" + privateKey + "|" + transactionRef;

//     console.log(concatString)

//                  var checkSum = Base64.encodeURI(bcrypt.hashSync(concatString, salt));

//     console.log(checkSum)


//     var args = {
//                                                 data: { logiId: data.loginId, key: data.key, senderId: data.senderId, msisdn: data.msisdn, messageBody: data.messageBody, transactionRef: transactionRef, checksum: checkSum},
//                                                 headers: { "Content-Type": "application/json" }
//                                             };
//                                             // let urlapi = cooperative.apiAuthorization.url;
//                                             console.log(args)
//                                         var req1 = client.post("https://credit-switch.com/api/v1/sendsms", args, function (data, response) {
//                                                 // parsed response body as js object
                                              
//                                                     // console.log(error)
                                             
//                                                     console.log("Data from creditswitch " + JSON.stringify(data));
//                                                     // raw response
//                                                     console.log('Response from creditswitch' + response);
                                                
                                               

//                  }).on('error', function (err) {
//                      console.log('something went wrong on the request');
//                  });

//                  // handling client error events
//                  client.on('error', function (err) {
//                      console.error('Something went wrong on the client', err);
//                  });
//             }).then((saved) => {

//                 callback.onSuccess(saved);
//             }).catch((error) => {
//                 callback.onError(error);
//             })
// }
}

module.exports = UserHandler;



// function sendEmail(emailLinks, emailaddress, temporaryPassword, cooperId, name, passToken) {

//     //nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         name: 'mail.cooperswitch.com',
//         host: 'mail.cooperswitch.com',
//         port: 26,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: 'info@cooperswitch.com', // generated ethereal user
//             pass: 'Accelerar@@1234' // generated ethereal password
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });

//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"Cooper Switch" <info@cooperswitch.com>', // sender address
//         to: `${emailaddress}`, // list of receivers
//         subject: 'Account Creation', // Subject line

//         html: `
//             Hi ${name}, <br/>
//             <p>Thank you for signing up with CooperSwitch. Your login details are as follow:</p>
//            <b>Cooper ID: ${cooperId}</b> <br/>
//            <b>Password: ${temporaryPassword}</b> <br/>
//            <p>The first time you log in, follow the instructions to create a new password for your account.</p>
//            <p>Thanks,</p><br/>
//            <p>Team CooperSwitch</p>'` // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
//     // });

// }


function sendEmail(emailLinks, emailaddress, temporaryPassword, cooperId, name, passToken) {

    var templateDir = path.join(__dirname, '../../', 'templates', 'regTemplates')

    const email = new Email({
        views: { root: templateDir },

        send: true,
        transport: {
            name: process.env.MAIL_NAME,
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME, // generated ethereal user
                pass: process.env.MAIL_PASSWORD // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        },


    });




        email.send({
            template: path.join(__dirname, '../../', 'templates', 'regTemplates'),
            message: {
                to: emailaddress,
                from: '"Cooper Switch" <info@cooperswitch.com>',
            },

            locals: {
                emailaddress: emailaddress,
                temporaryPassword: temporaryPassword,
                cooperId: cooperId,
                name: name,
                passToken: passToken
            }
        })
            .then((console.log))
            .catch(console.error);
        // setup email data with unicode symbols


    
}



function sendCooperativeEmail(emailLinks, staffId) {

    var templateDir = path.join(__dirname, '../../', 'templates', 'cooperativeTem')

    const email = new Email({
        views: { root: templateDir },

        send: true,
        transport: {
            name: process.env.MAIL_NAME,
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME, // generated ethereal user
                pass: process.env.MAIL_PASSWORD // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        },


    });

        email.send({
            template: path.join(__dirname, '../../', 'templates', 'cooperativeTem'),
            message: {
                to: process.env.COOPLAG_MAIL,
                from: '"Cooper Switch" <info@cooperswitch.com>',
            },

            locals: {
                emailaddress: process.env.COOPLAG_MAIL,
                staffId: staffId
               
            }
        })
            .then(console.log)
            .catch(console.error);


}


function sendSMS(url, apiKey, username, sender, messagetext, flash, recipients) {

    var propertiesObject = { apiKey: apiKey, username: username, sender: sender, messagetext: messagetext, flash: flash, recipients: recipients };

    request({ url: url, qs: propertiesObject }, function(err, response, body) {
        if (err) { console.log(err); return; }
        console.log("Get response: " + response.statusCode);
    });

}


function sendSMS2( messagetext, recipients) {


    // request('http://knp4x.api.infobip.com/sms/1/text/query?username=cooperswitch&password=Accelerar1&to=' + mainphoneNumber + '&flash=0&text=' + messagetext, function (error, response, body) {

    var mainphoneNumber = "234" + recipients.replace(/^0+/, '');

    console.log("Token Recipient " + mainphoneNumber);
    var request = require('request');
        request('http://knp4x.api.infobip.com/sms/1/text/query?username=cooperswitch&password=Accelerar1&from=cooper&to=' + mainphoneNumber + '&text=' + messagetext, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    }).on('error', () => console.log('errored'));



    // var propertiesObject = { apiKey: apiKey, username: username, sender: sender, messagetext: messagetext, flash: flash, recipients: recipients };

    // request({ url: url, qs: propertiesObject }, function(err, response, body) {
    //     if (err) { console.log(err); return; }
    //     console.log("Get response: " + response.statusCode);
    // });

}




// function getCheckSum() {

//    let loginId = '38457';
//    let privateKey = 'XY1t9Y159hWJaETD';

//    let concatString = loginId + privateKey;

//    console.log(concatString)

//    var checksum = Base64.encodeURI(bcrypt.hashSync(concatString, saltRounds));
//    console.log(checksum)
// }