/**
 *  Created by Accelerar on 3/6/2018.
 */
const RatingModel = require(APP_MODEL_PATH + 'rating').RatingModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class RatingHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_RATING_SCHEMA() {
        return {
            'productId': {
                notEmpty: true,

                errorMessage: 'Invalid Product Id'
            },

        };
    }

    createRating(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(RatingHandler.VERIFY_RATING_SCHEMA);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }




                return new RatingModel({

                    cooperId: validator.trim(data.cooperId),
                    productId: validator.trim(data.productId),
                    comment: validator.trim(data.comment),
                    rating: validator.trim(data.rating),
                    status: "Active"



                });
            })
            .then((rating) => {
                rating.save();
                return rating;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleterating(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Rating Id').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    RatingModel.findOne({ _id: req.params.id }, function (err, rating) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!rating) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(rating);
                            }
                        }
                    })
                });
            })
            .then((rating) => {
                rating.remove();
                return rating;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updaterating(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(RatingHandler.VERIFY_RATING_SCHEMA);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    RatingModel.findOne({ _id: req.params.id }, function (err, rating) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!rating) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(rating);
                            }
                        }
                    })
                });
            })
            .then((rating) => {
                rating.status = validator.trim(data.status);
                rating.comment = validator.trim(data.comment);
                rating.dateModified = new Date();
                rating.save();
                return rating;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSinglerating(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Rating provided').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    RatingModel.findOne({ _id: req.params.id }, function (err, rating) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!rating) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(rating);
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

    getAllrating(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
            RatingModel.find({}, function (err, rating) {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(rating);
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

module.exports = RatingHandler;