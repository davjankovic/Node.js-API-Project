/**
 *  Created by Accelerar on 3/6/2018.
 */
const SizeModel = require(APP_MODEL_PATH + 'sizes').SizeModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class SizeHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    createSize(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }




                return new SizeModel({

                    size: data.size,
                    status: "Active"



                });
            })
            .then((cooper) => {
                cooper.save();
                return cooper;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteSize(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Notification Id').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    SizeModel.findOne({ _id: req.params.id }, function (err, size) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!size) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(size);
                            }
                        }
                    })
                });
            })
            .then((size) => {
                size.remove();
                return size;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateSize(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    SizeModel.findOne({ _id: req.params.id}, function (err, size) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!size) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(size);
                            }
                        }
                    })
                });
            })
            .then((size) => {
                size.size = data.size;
                size.dateModified = new Date();
                size.save();
                return size;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

 
    getAllSizes(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
            SizeModel.find({}, function (err, size) {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(size);
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

module.exports = SizeHandler;