/**
 *  Created by Accelerar on 3/6/2018.
 */
const ProductLikeModel = require(APP_MODEL_PATH + 'productlikes').ProductLikeModel;


const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class ProductLikeHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get PRODUCT_LIKE_VALIDATION_SCHEME() {

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
    createProductLike(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ProductLikeHandler.PRODUCT_LIKE_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }


                return new ProductLikeModel({
                    productId: validator.trim(data.productId),
                    cooperId: validator.trim(data.cooperId),
                    userId: validator.trim(data.userId),
                    vendorId: data.vendorId,
                    product: data.productId,
                    user: data.userId

                });
            })
            .then((productlike) => {
                return new Promise(function(resolve, reject) {
                    ProductLikeModel.find({ productId: productlike.productId, cooperId: productlike.cooperId }, function(err, docs) {
                        if (docs.length) {
                            reject(new AlreadyExistsError("User has already liked this product"));
                        } else {
                            resolve(productlike);
                        }
                    });
                });
            })
            .then((productlike) => {
                productlike.save();
                return productlike;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteProductLike(req, callback) {
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
                    ProductLikeModel.findOne({ _id: req.params.id }, function(err, product) {
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

    updateProductLike(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ProductLikeHandler.PRODUCT_LIKE_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ProductLikeModel.findOne({ _id: req.params.id }, function(err, product) {
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






    getSingleProductLike(req, callback) {
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
                    ProductLikeModel.findOne({ productId: req.params.id, cooperId: req.params.userId }, function(err, product) {
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


    getAllProductLikes(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                ProductLikeModel.find({}, function(err, posts) {
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

module.exports = ProductLikeHandler;