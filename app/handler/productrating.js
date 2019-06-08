/**
 *  Created by Accelerar on 3/6/2018.
 */
const ProductRatingModel = require(APP_MODEL_PATH + 'productrating').ProductRatingModel;


const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');


class ProductRateHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get PRODUCT_RATE_VALIDATION_SCHEME() {

        return {
            'vendorId': {
                notEmpty: true,

                errorMessage: 'Invalid Vendor Id'
            },

            'cooperId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooper Id'
            },
            'userId': {
                notEmpty: true,

                errorMessage: 'Invalid User Id'
            },

            'productId': {
                notEmpty: true,

                errorMessage: 'Invalid Product Id'
            },
            'rate': {
                notEmpty: true,

                errorMessage: 'Invalid Rate'
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
    createProductRate(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ProductRateHandler.PRODUCT_RATE_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }


                return new ProductRatingModel({
                    productId: validator.trim(data.productId),
                    cooperId: validator.trim(data.cooperId),
                    userId: validator.trim(data.userId),
                    vendorId: data.vendorId,
                    product: data.productId,
                    user: data.userId,
                    rate: data.rate

                });
            })
            .then((productrate) => {
                return new Promise(function(resolve, reject) {
                    ProductRatingModel.find({ productId: productrate.productId, cooperId: productrate.cooperId }, function(err, docs) {
                        if (docs.length) {
                            reject(new AlreadyExistsError("User has already Rated this product"));
                        } else {
                            resolve(productrate);
                        }
                    });
                });
            })
            .then((productrate) => {
                productrate.save();
                return productrate;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteProductRate(req, callback) {
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
                    ProductRatingModel.findOne({ _id: req.params.id }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product Like not found"));
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

    updateProductRate(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ProductRateHandler.PRODUCT_RATE_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ProductRatingModel.findOne({ _id: req.params.id }, function(err, product) {
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






    getSingleProductRate(req, callback) {
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
                    ProductRatingModel.findOne({ productId: req.params.id, cooperId: req.params.userId }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
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


    getAllProductRates(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                ProductRatingModel.find({}, function(err, posts) {
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

module.exports = ProductRateHandler;