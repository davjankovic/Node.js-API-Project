/**
 *  Created by Accelerar on 3/6/2018.
 */
const ProductCategoryModel = require(APP_MODEL_PATH + 'productcategory').ProductCategoryModel;
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;
const CategoryModel = require(APP_MODEL_PATH + "category").CategoryModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class ProductCategoryHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_PRODUCTCATEGORY_SCHEMA() {
        return {
            'productId': {
                notEmpty: true,

                errorMessage: 'Invalid Product Id'
            },
            'categoryId': {
                notEmpty: true,

                errorMessage: 'Invalid Category Id'
            }

        };
    }

    createProductCategory(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ProductCategoryHandler.VERIFY_PRODUCTCATEGORY_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function(resolve, reject) {
                    ProductCategoryModel.findOne({ categoryId: data.categoryId, productId: data.productId }, function(err, procat) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!procat) {
                                resolve(new ProductCategoryModel({

                                    category: validator.trim(data.categoryId),
                                    productId: validator.trim(data.productId),
                                    product: validator.trim(data.productId)

                                }));

                            } else {
                                reject(new NotFoundError("Product Category Exist"));
                            }
                        }
                    })
                });




            })
            .then((procat) => {
                procat.save();
                return procat;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteProductCategory(req, callback) {
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
                    ProductCategoryModel.findOne({ _id: req.params.id }, function(err, procat) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!procat) {
                                reject(new NotFoundError("Product Category is not found"));
                            } else {
                                resolve(procat);
                            }
                        }
                    })
                });
            })
            .then((procat) => {
                procat.remove();
                return procat;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateProductCategory(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ProductCategoryHandler.VERIFY_PRODUCTCATEGORY_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ProductCategoryModel.findOne({ _id: req.params.id }, function(err, procat) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!procat) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(procat);
                            }
                        }
                    })
                });
            })
            .then((procat) => {
                procat.categoryId = validator.trim(data.categoryId);
                procat.productId = validator.trim(data.productId);
                procat.product = validator.trim(data.productId);

                procat.dateModified = new Date();
                procat.save();
                return procat;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleProductCategory(req, callback) {
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
                    ProductCategoryModel.findOne({ _id: req.params.id }, function(err, procat) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!procat) {
                                reject(new NotFoundError("Product Category not found"));
                            } else {
                                resolve(procat);
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

    getProductByCategory(req, callback) {
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
                    const products = [];
                    ProductCategoryModel.find({ categoryId: req.params.id }, function(err, product) {
                        if (err !== null) {

                            console.log("Error " + JSON.stringify(err));
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                console.log("Products Found " + JSON.stringify(product));
                                resolve(product);

                                // product.forEach(function(element) {
                                //     //console.log(element);

                                //     ProductModel.find({ _id: element.productId }, function(err, docs) {
                                //         if (docs) {
                                //             //resolve(docs);
                                //             docs.forEach(function(innerelement) {
                                //                 console.log(innerelement);
                                //                 products.push(innerelement)
                                //             });

                                //         } else {

                                //         }
                                //     });
                                // });

                                // resolve(product);
                            }
                        }
                    })

                    //resolve(products);
                });
            }).then((product) => {




                // resolve(new UserModel({
                //     firstName: cooperativeStaff.name,
                //     lastName: cooperativeStaff.name,
                //     phoneNo: cooperativeStaff.phone,
                //     email: cooperativeStaff.email,
                //     staffId: cooperativeStaff.staffId,
                //     cooperativeId: cooperativeStaff.cooperativeId,
                //     password: passwordgen,
                //     cooperId: cooperId,
                //     resetPasswordToken: passToken,
                //     resetPasswordExpires: Date.now() + 86400000,
                //     userMode: "New"
                // }));

                return product;
            })
            .then((products) => {

                console.log("Products Found " + JSON.stringify(products));
                callback.onSuccess(products);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }




    getProductCategoryOnSale( req, callback) {
        console.log("Reaching Single Product " + req.params.id);
        let data = req.body;
        req.checkParams('id', 'Invalid Status Provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {

                    var curr = new Date; // get current date
                    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                    var last = first + 6; // last day is the first day + 6

                    var firstday = new Date(curr.setDate(first));
                    var lastday = new Date(curr.setDate(last));

                    ProductModel.find({ status: req.params.id, dateModified: { "$gte": new Date(firstday), "$lt": new Date(lastday) }}, function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Category not found"));
                            } else {
                                
                                ProductCategoryModel.find({ productId: product }, function (err, product) {
                                    if (err !== null) {
                                        reject(err);
                                    } else {
                                        if (!product) {
                                            reject(new NotFoundError("Category not found"));
                                        } else {


                                            resolve(product);
                                        }
                                    }
                                })
                                resolve(product);
                                
                            }
                        }
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

    getTopCategory(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
            ProductCategoryModel.aggregate([


                { $lookup: { from: 'categories', 
                localField: 'category', 
                foreignField: '_id',
                 as: 'product_doc' } },
                 
                { "$group": { "_id": { "product_doc": "$product_doc" }, number: { "$sum": 1 } } },
                { $sort: { number: -1 } },
            ], function (err, cat) {
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


    shopByCategory(req, callback) {
        let data = req.body;
        let category = data.categoryName;
      
        new Promise(function (resolve, reject) {
            ProductCategoryModel.aggregate(
              [
                {
                  $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category_doc"
                  }
                },
                {
                  $unwind: "$category_doc"
                },

                {
                  $match: { "category_doc.categoryName": category }
                },
                {
                    $lookup: {
                            from: "products",
                            localField: "product",
                            foreignField: "_id",
                            as: "product_doc"
                        }
                },
                {
                     $unwind: "$product_doc"
                },



                // {
                //   $group: {
                //     _id: { product_doc: "$product_doc" },
                //     number: { $sum: 1 }
                //   }
                // },
                // { $sort: { number: -1 } }
              ],
              function(err, cat) {
                if (err !== null) {
                  reject(err);
                } else {
                  resolve(cat);
                }
              }
            );
        })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
    // getProductCategoryOnSale(req, callback) {
    //     console.log("Reaching Single Product " + req.params.id);
    //     let data = req.body;
    //     req.checkParams('id', 'Invalid Status Provided');
    //     req.getValidationResult()
    //         .then(function (result) {
    //             if (!result.isEmpty()) {
    //                 let errorMessages = result.array().map(function (elem) {
    //                     return elem.msg;
    //                 });
    //                 throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
    //             }
    //             return new Promise(function (resolve, reject) {

    //                 var curr = new Date; // get current date
    //                 var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    //                 var last = first + 6; // last day is the first day + 6

    //                 var firstday = new Date(curr.setDate(first));
    //                 var lastday = new Date(curr.setDate(last));

    //                 ProductCategoryModel.find({}, function (err, product) {
    //                     if (err !== null) {
    //                         reject(err);
    //                     } else {
    //                         if (!product) {
    //                             reject(new NotFoundError("Category not found"));
    //                         } else {


    //                             resolve(product);
    //                         }
    //                     }
    //                 })
    //                     .populate({
    //                         match: { 
    //                         status: { $eq: req.params.id }, 
    //                         dateModified: { "$gte": new Date(firstday), 
    //                         "$lt": new Date(lastday) } },
    //                        path: 'product', 
                    
    //                     })
                     


    //             });
    //         })
    //         .then((post) => {

    //             callback.onSuccess(post);
    //         })
    //         .catch((error) => {
    //             callback.onError(error);
    //         });
    // }

    getAllProductAccess(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
            ProductCategoryModel.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category_doc"
                    }
                },

                {
                    $lookup: {
                        from: "products",
                        localField: "product",
                        foreignField: "_id",
                        as: "product_doc"
                    }
                },
        
                {
                    $match: { 'category_doc.categoryName': "Electronics and Gadgets"  }
                },
            
                
                {
                  $group: {
                    _id: null,
                    count: { $sum: 1 },
                    data: { $push: "$$ROOT" }
                  }

                
                }
                

              ],
              function(err, cat) {
                if (err !== null) {
                  reject(err);
                } else {
                  resolve(cat);
                }
              }
            );
        })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllProductCategory(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                ProductCategoryModel.find({}, function(err, cat) {
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

module.exports = ProductCategoryHandler;