/**
 *  Created by Accelerar on 3/30/2018.
 */
const AdvertModel = require(APP_MODEL_PATH + 'advert').AdvertModel;
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
const multer = require('multer');
validator = require('validator');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class AdvertHandler extends BaseAutoBindedClass {
    constructor() {
        super();
       
    }

    static get VERIFY_ADVERT_SCHEMA() {
        return {
            'ownerName': {
                notEmpty: true,

                errorMessage: 'Invalid Owner Name'
            },
            'email': {
                notEmpty: true,

                errorMessage: 'Invalid Email'
            },
            'phoneNumber': {
                notEmpty: true,

                errorMessage: 'Invalid Phone Number'
            },
            'redirectURL': {
                notEmpty: true,

                errorMessage: 'redirectURL can\'t be empty'
            }
          

        };
    }




    createAdvert(req, callback, res) {

        var filenameConcat = "";


        var Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "public/adverts");
            },
            filename: function (req, file, callback) {

                filenameConcat = file.fieldname + "_" + Date.now() + "_" + file.originalname;
                callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            }
        });

        var upload = multer({ storage: Storage }).single("advertImagePath"); //Field name and max count
        // var _that = this;
        upload(req, res, function (err) {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }
        let data = req.body;
            // let validator = this._validator;
        req.checkBody(AdvertHandler.VERIFY_ADVERT_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function(resolve, reject) {
                    AdvertModel.findOne({ ownerName: data.ownerName }, (err, advert) => {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!advert) {
                                const url = req.protocol + '://' + req.get('host');
                                resolve(new AdvertModel({

                                    ownerName: validator.trim(data.ownerName),
                                    email: validator.trim(data.email),
                                    phoneNumber: validator.trim(data.phoneNumber),
                                    advertImagePath: url + '/adverts/' + filenameConcat,
                                    redirectURL: validator.trim(data.redirectURL)
                                }));

                            } else {
                                // reject(new NotFoundError("Product Category Exist"));
                                const url = req.protocol + '://' + req.get('host');
                                resolve(new AdvertModel({

                                    ownerName: validator.trim(data.ownerName),
                                    email: validator.trim(data.email),
                                    phoneNumber: validator.trim(data.phoneNumber),
                                    advertImagePath: url + '/adverts/' + filenameConcat,
                                    redirectURL: validator.trim(data.redirectURL)

                                }));

                            }
                        }
                    })
                });




            })
            .then((advert) => {
                advert.save();
                return advert;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });

        });
    }

    deleteAdvert(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid  Id').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    AdvertModel.findOne({ _id: req.params.id }, function(err, advert) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!advert) {
                                reject(new NotFoundError("Product Category is not found"));
                            } else {
                                resolve(advert);
                            }
                        }
                    })
                });
            })
            .then((advert) => {
                advert.remove();
                return advert;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateAdvert(req, callback, res) {

        var filenameConcat = "";


        var Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "public/adverts");
            },
            filename: function (req, file, callback) {

                filenameConcat = file.fieldname + "_" + Date.now() + "_" + file.originalname;
                callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            }
        });

        var upload = multer({ storage: Storage }).single("advertImagePath"); //Field name and max count
        // var _that = this;
        upload(req, res, function (err) {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }
        let data = req.body;
        // let validator = this._validator;
        req.checkBody(AdvertHandler.VERIFY_ADVERT_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    AdvertModel.findOne({ _id: req.params.id }, function(err, advert) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!advert) {
                                reject(new NotFoundError("Advert not found"));
                            } else {
                                resolve(advert);
                            }
                        }
                    })
                });
            })
            .then((advert) => {
                const url = req.protocol + '://' + req.get('host');
                advert.ownerName = validator.trim(data.ownerName);
                advert.email = validator.trim(data.email);
                advert.phoneNumber = validator.trim(data.phoneNumber);
                advert.advertImagePath = url + '/adverts/' + filenameConcat,
                advert.redirectURL = validator.trim(data.redirectURL);


                advert.dateModified = new Date();
                advert.save();
                return advert;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
        });
    }

    getSingleAdvert(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Id provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    AdvertModel.findOne({ _id: req.params.id }, function(err, advert) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!advert) {
                                reject(new NotFoundError("Advert not found"));
                            } else {
                                resolve(advert);
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




    getAllAdverts(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                AdvertModel.find({}, function(err, advert) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(advert);
                    }
                });
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}

module.exports = AdvertHandler;