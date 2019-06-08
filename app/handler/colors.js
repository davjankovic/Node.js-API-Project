/**
 *  Created by Accelerar on 3/6/2018.
 */
const ColorModel = require(APP_MODEL_PATH + 'colors').ColorModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class ColorHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    createColor(req, callback) {
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




                return new ColorModel({

                    color: data.color,
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

    deleteColor(req, callback) {
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
                    ColorModel.findOne({ _id: req.params.id }, function (err, color) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!color) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(color);
                            }
                        }
                    })
                });
            })
            .then((color) => {
                color.remove();
                return color;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateColor(req, callback) {
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
                    ColorModel.findOne({ _id: req.params.id }, function (err, color) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!color) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(color);
                            }
                        }
                    })
                });
            })
            .then((color) => {
                color.color = data.color;
                color.dateModified = new Date();
                color.save();
                return color;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllColor(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
            ColorModel.find({}, function (err, color) {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(color);
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

module.exports = ColorHandler;