/**
 *  Created by Accelerar on 3/6/2018.
 */
const UserAddressModel = require(APP_MODEL_PATH + 'useraddresses').UserAddressModel;


const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');


class UserAddressHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get USER_ADDRESS_VALIDATION_SCHEME() {

        return {
            'address': {
                notEmpty: true,

                errorMessage: 'Invalid Address'
            },

            'cooperId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooper Id'
            },
            'userId': {
                notEmpty: true,

                errorMessage: 'Invalid User Id'
            },




        };
    }




    static get LIKE_PRODUCT_VALIDATION_SCHEME() {
        return {

            'productId': {
                notEmpty: true,

                errorMessage: 'Invalid product'
            },

        };
    }
    createUserAddress(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(UserAddressHandler.USER_ADDRESS_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }


                return new UserAddressModel({
                    address: validator.trim(data.address),
                    cooperId: validator.trim(data.cooperId),
                    userId: validator.trim(data.userId),
                    user: data.userId

                });
            })
            .then((useraddress) => {
                return new Promise(function(resolve, reject) {
                    UserAddressModel.find({ address: useraddress.address, cooperId: useraddress.cooperId }, function(err, docs) {
                        if (docs.length) {
                            reject(new AlreadyExistsError("User Address Already exist"));
                        } else {
                            resolve(useraddress);
                        }
                    });
                });
            })
            .then((useraddress) => {
                useraddress.save();
                return useraddress;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteUserAddress(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Token provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    UserAddressModel.findOne({ _id: req.params.id }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("User Address not found"));
                            } else {
                                resolve(product);
                            }
                        }
                    })
                });
            })
            .then((product) => {
                product.remove();
                return product;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateUserAddress(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(UserAddressHandler.USER_ADDRESS_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    UserAddressModel.findOne({ _id: req.params.id }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("User product like not found"));
                            } else {
                                resolve(product);
                            }
                        }
                    })
                });
            })
            .then((product) => {
                product.address = data.address;
                product.dateModified = new Date();
                product.save();
                return product;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }






    getSingleUserAddresses(req, callback) {
        console.log("Reaching Single Product " + req.params.id);
        let data = req.body;
        req.checkParams('id', 'Invalid Product provided').isMongoId();
        req.checkParams('userId', 'Invalid User Id provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    UserAddressModel.findOne({ cooperId: req.params.userId }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("User address not found"));
                            } else {
                                console.log("User ID " + req.params.userId);



                                resolve(product);
                            }
                        }
                    })
                });
            })
            .then((post) => {

                console.log("Single Product Found " + post);
                callback.onSuccess(post);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllUserAddresses(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                UserAddressModel.find({}, function(err, posts) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(posts);
                    }
                });
            })
            .then((posts) => {
                callback.onSuccess(posts);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


}

module.exports = UserAddressHandler;