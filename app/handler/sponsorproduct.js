/**
 *  Created by Accelerar on 3/30/2018.
 */
const SponsorProductModel = require(APP_MODEL_PATH + 'sponsorproduct').SponsorProductModel;
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class SponsorProductHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_SPONSORPRODUCT_SCHEMA() {
        return {
            'categoryId': {
                notEmpty: true,

                errorMessage: 'Invalid Category Id'
            },
            'productId': {
                notEmpty: true,

                errorMessage: 'Invalid Product Id'
            },
            'email': {
                notEmpty: true,

                errorMessage: 'Invalid Email'
            },
            'phoneNumber': {
                notEmpty: true,

                errorMessage: 'Invalid Phone Number'
            },
            'product': {
                notEmpty: true,

                errorMessage: 'Invalid Advert Image'
            },
            'status': {
                notEmpty: true,

                errorMessage: 'Invalid Status'
            }




        };
    }




    createSponsorProduct(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(SponsorProductHandler.VERIFY_SPONSORPRODUCT_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function(resolve, reject) {
                    SponsorProductModel.findOne({ ownerName: data.ownerName }, function(err, sponsorproduct) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!sponsorproduct) {
                                resolve(new SponsorProductModel({
                                    categoryId: validator.trim(data.categoryId),
                                    productId: validator.trim(data.productId),
                                    ownerName: validator.trim(data.ownerName),
                                    email: validator.trim(data.email),
                                    phoneNumber: validator.trim(data.phoneNumber),
                                    product: validator.trim(data.product),
                                    status: validator.trim(data.status)
                                }));




                            } else {
                                // reject(new NotFoundError("Product Category Exist"));

                                resolve(new SponsorProductModel({

                                    categoryId: validator.trim(data.categoryId),
                                    productId: validator.trim(data.productId),
                                    ownerName: validator.trim(data.ownerName),
                                    email: validator.trim(data.email),
                                    phoneNumber: validator.trim(data.phoneNumber),
                                    product: validator.trim(data.product),
                                    status: validator.trim(data.status)

                                }));

                            }
                        }
                    })
                });




            })
            .then((sponsorproduct) => {
                sponsorproduct.save();
                return sponsorproduct;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteSponsorProduct(req, callback) {
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
                    SponsorProductModel.findOne({ _id: req.params.id }, function(err, sponsorproduct) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!sponsorproduct) {
                                reject(new NotFoundError("Product Category is not found"));
                            } else {
                                resolve(sponsorproduct);
                            }
                        }
                    })
                });
            })
            .then((sponsorproduct) => {
                sponsorproduct.remove();
                return sponsorproduct;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateSponsorProduct(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(SponsorProductHandler.VERIFY_SPONSORPRODUCT_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    SponsorProductModel.findOne({ _id: req.params.id }, function(err, sponsorproduct) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!sponsorproduct) {
                                reject(new NotFoundError("Advert not found"));
                            } else {
                                resolve(sponsorproduct);
                            }
                        }
                    })
                });
            })
            .then((adsponsorproductvert) => {
                sponsorproduct.categoryId = validator.trim(data.categoryId);
                sponsorproduct.productId = validator.trim(data.productId);
                sponsorproduct.ownerName = validator.trim(data.ownerName);
                sponsorproduct.email = validator.trim(data.email);
                sponsorproduct.phoneNumber = validator.trim(data.phoneNumber);
                sponsorproduct.product = validator.trim(data.product);
                sponsorproduct.status = validator.trim(data.status);


                sponsorproduct.dateModified = new Date();



                sponsorproduct.save();
                return sponsorproduct;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleSponsorProduct(req, callback) {
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
                    SponsorProductModel.findOne({ _id: req.params.id }, function(err, sponsorproduct) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!sponsorproduct) {
                                reject(new NotFoundError("Advert not found"));
                            } else {
                                resolve(sponsorproduct);
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




    getAllSponsorProducts(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {

                var query = SponsorProductModel.find({});


                query.limit(3);


                query.exec(function(err, sponsorproduct) {
                    // called when the `query.complete` or `query.error` are called
                    // internally


                    if (err !== null) {
                        reject(err);
                    } else {
                        if (!sponsorproduct) {
                            reject(new NotFoundError("Token not found"));
                        } else {
                            resolve(sponsorproduct);
                        }
                    }
                });

                // SponsorProductModel.find({}, function(err, sponsorproduct) {
                //     if (err !== null) {
                //         reject(err);
                //     } else {
                //         resolve(sponsorproduct);
                //     }
                // });



            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}

module.exports = SponsorProductHandler;