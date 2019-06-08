/**
 *  Created by Accelerar on 3/6/2018.
 */
const ProductViewModel = require(APP_MODEL_PATH + 'productview').ProductViewModel;
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class ProductViewHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_PRODUCTVIEW_SCHEMA() {
        return {
            'productId': {
                notEmpty: true,

                errorMessage: 'Invalid Product Id'
            },
            'userId': {
                notEmpty: true,

                errorMessage: 'Invalid Category Id'
            }

        };
    }

    createProductView(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ProductViewHandler.VERIFY_PRODUCTVIEW_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function(resolve, reject) {
                    ProductViewModel.findOne({ userId: data.categoryId, productId: data.productId }, function(err, proview) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!proview) {
                                resolve(new ProductViewModel({

                                    userId: validator.trim(data.userId),
                                    productId: validator.trim(data.productId)


                                }));

                            } else {
                                //reject(new NotFoundError("Product Category Exist"));
                                resolve(new ProductViewModel({

                                    userId: validator.trim(data.userId),
                                    productId: validator.trim(data.productId)


                                }));
                            }
                        }
                    })
                });




            })
            .then((proview) => {
                proview.save();
                return proview;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteProductView(req, callback) {
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
                    ProductViewModel.findOne({ _id: req.params.id }, function(err, proview) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!proview) {
                                reject(new NotFoundError("ProductView is not found"));
                            } else {
                                resolve(proview);
                            }
                        }
                    })
                });
            })
            .then((proview) => {
                proview.remove();
                return proview;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateProductView(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ProductViewHandler.VERIFY_PRODUCTVIEW_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ProductViewModel.findOne({ _id: req.params.id }, function(err, proview) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!proview) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(proview);
                            }
                        }
                    })
                });
            })
            .then((proview) => {

                proview.productId = validator.trim(data.productId);
                proview.dateModified = new Date();
                proview.save();
                return proview;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleProductView(req, callback) {
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


                    var productList = [];

                    // ProductViewModel.aggregate([{ "$sort": { "name": 1, "date": 1 } },

                    //         // Then group
                    //         {
                    //             "$group": {
                    //                 "_id": "$productId",
                    //                 "product": { "$first": "$product" },
                    //                 "date": { "$first": "$dateCreated" }
                    //             }
                    //         }
                    //     ], function(err, proview) {
                    //         if (err !== null) {
                    //             reject(err);
                    //         } else {
                    //             if (!proview) {
                    //                 reject(new NotFoundError("Product View not found"));
                    //             } else {


                    //                     // resolve(new ProductModel(productList));

                    //                 return productList;
                    //             }
                    //         }
                    //     })

                    ProductViewModel.distinct("productId", { userId: req.params.id }, function(err, proview) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!proview) {
                                reject(new NotFoundError("Product View not found"));
                            } else {

                                // ProductModel.find({
                                //     '_id': { $in: proview }
                                // }, function(err, docs) {
                                //     console.log(" Products " + docs);
                                //     resolve(docs);
                                // });


                                var query = ProductModel.find({ '_id': { $in: proview } });


                                query.limit(3);


                                query.exec(function(err, docs) {
                                    // called when the `query.complete` or `query.error` are called
                                    // internally


                                    if (err !== null) {
                                        reject(err);
                                    } else {
                                        if (!docs) {
                                            reject(new NotFoundError("Product View not found"));
                                        } else {
                                            resolve(docs);
                                        }
                                    }
                                });






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

    getAllPopularProduct(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
            ProductViewModel.aggregate([
       
                
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product_doc' } },
                { "$group": { "_id": { "product_doc": "$product_doc" }, number: { "$sum": 1 } } },
                { $sort: { number: -1 } },
            ], function(err, cat) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(cat);
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

    getRecommendedProduct(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
            ProductViewModel.aggregate([{ $sample: { size: 10 } },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product_doc' } },
            ]
            , function (err, cat) {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(cat);
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

    getAllProductView(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
            ProductViewModel.find({}, function (err, cat) {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(cat);
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

module.exports = ProductViewHandler;