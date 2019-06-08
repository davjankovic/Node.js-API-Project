/**
 *  Created by Accelerar on 3/6/2018.
 */
const nodemailer = require("nodemailer");
const ProductModel = require(APP_MODEL_PATH + 'Product').ProductModel;
const CooperativeAPIModel = require(APP_MODEL_PATH + 'cooperativeAPI').CooperativeAPIModel;
const UserModel = require(APP_MODEL_PATH + 'user').UserModel;
const TransactionModel = require(APP_MODEL_PATH + 'transaction').TransactionModel;
const ProductViewModel = require(APP_MODEL_PATH + 'productview').ProductViewModel;
const ProductCategoryModel = require(APP_MODEL_PATH + 'productcategory').ProductCategoryModel;
const UnauthorizedError = require(APP_ERROR_PATH + "unauthorized");
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
var Client = require("node-rest-client").Client;
var client = new Client();
var multer = require("multer");
var mongoose = require('mongoose');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
};

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        callback(error, "public/productimages");

    },
    filename: function (req, file, callback) {

        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

class ProductHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get PRODUCT_VALIDATION_SCHEME() {
        return {
            'vendorId': {
                notEmpty: true,

                errorMessage: 'Invalid Vendor Id'
            },

            'productName': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 5, max: 30 }],
                    errorMessage: 'Product Name should be between 5 and 30 characters'
                },
                errorMessage: 'Invalid product name'
            },

            'brand': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 1, max: 30 }],
                    errorMessage: 'Brand should be between 5 and 30 characters'
                },
                errorMessage: 'Invalid brand'
            },
            'location': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 5, max: 100 }],
                    errorMessage: 'Location should be between 5 and 30 characters'
                },
                errorMessage: 'Invalid location'
            },
            'quantity': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 0, max: 30 }],
                    errorMessage: 'quantity should be between 0 and 30 characters'
                },
                errorMessage: 'Invalid quantity'
            },
            'price': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 0, max: 100 }],
                    errorMessage: 'price should be between 0 and 30 characters'
                },
                errorMessage: 'Invalid price'
            },


        };
    }



    static get DEDUCT_PRODUCT_VALIDATION_SCHEME() {
        return {

            'productId': {
                notEmpty: true,

                errorMessage: 'Invalid product'
            },


            'quantity': {
                notEmpty: true,

                errorMessage: 'Invalid quantity'
            },

            'cooperId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooper Id'
            },

            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative Id'
            },

            // 'staffId': {
            //     notEmpty: true,

            //     errorMessage: 'Invalid Staff Id'
            // },

            // 'transAmount': {
            //     notEmpty: true,

            //     errorMessage: 'Invalid Trans Amount'
            // },





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

    
    createProduct(req, userToken, callback, res) {

        console.log("Reaching File Upload");
        

        var upload = multer({ storage: Storage }).fields([
            { name: "productImage"},
            { name: "productBackImage"},
            { name: "productLeftImage"},
            { name: "productRightImage"}
        ]); //Field name and max count
        var _that = this;
 
        upload(req, res, (err) => {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }

         

            let files = req.files;

        let data = req.body;
        let validator = this._validator;
        // req.checkBody(ProductHandler.PRODUCT_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                // console.log(req.files);
                if (userToken.cooperId !== data.vendorId) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                var date = new Date();
                date.setDate(date.getDate());
                const url = req.protocol + '://' + req.get('host');
                const productid = uidgen.generateSync();
              
                let prod =  new ProductModel({
                    vendorId: data.vendorId,
                    productName: data.productName,
                    productImage: url + '/productimages/'+ files.productImage[0].filename.toString('base64'),
                    productBackImage: url + '/productimages/' + files.productBackImage[0].filename,
                    productLeftImage: url + '/productimages/' + files.productLeftImage[0].filename,
                    productRightImage: url + '/productimages/' + files.productRightImage[0].filename,
                    productBriefDesc: data.productBriefDesc,
                  productDetailDesc: data.productDetailDesc,
                    productSpec: data.productSpec,
                    brand: data.brand,
                    location: data.location,
                    quantity: data.quantity,
                    price: data.price,
                  expires: data.expires,
                  productId: productid,
                  dateCreated: date,
                  status: "unverified",
                    salePrice: data.salePrice,
                  sizessize: data.sizes,
                  colors: data.colors,
                  tags: data.tags
                });

                prod.save();
                if(prod){
                    let productCart = new ProductCategoryModel(
                        {
                            category: data.categoryId,
                            productId: prod.productId,
                            product: prod._id
                        }
                    );
                    productCart.save();
                    return productCart;


                }
                
            }

            })
            .then((product) => {
                product.save();
                return product;
            })
            // .then((product) =>{
            //    let cate = new ProductCategoryModel({
            //        category: data.categoryId,
            //        productId: product.productId,
            //        product: product._id

            //    });
            //    cate.save();
            //    return cate;
            // })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });

        });
    }

    deleteProduct(req, callback) {
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
                    ProductModel.findOne({ _id: req.params.id }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
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

    updateProduct(req, userToken, callback, res) {

        console.log("Reaching File Upload");

    
        var upload = multer({ storage: Storage }).fields([
            { name: "productImage", maxCount: 1 },
            { name: "productBackImage" },
            { name: "productLeftImage" },
            { name: "productRightImage" }
        ]); //Field name and max count
        var _that = this;
        upload(req, res, (err) => {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }

            let files = req.files;

        let data = req.body;
        let validator = this._validator;
        // req.checkBody(ProductHandler.PRODUCT_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                if (userToken.cooperId !== data.vendorId) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                return new Promise(function(resolve, reject) {
                    ProductModel.findOne({ _id: req.params.id }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(product);
                            }
                        }
                    })
                });
            }
            })
            .then((product) => {
                const url = req.protocol + "://" + req.get("host");
                    product.productName =  data.productName,
                        product.productImage = url + '/productimages/' + files.productImage[0].filename,
                        product.productBackImage = url + '/productimages/' + files.productBackImage[0].filename,
                        product.productLeftImage = url + '/productimages/' + files.productLeftImage[0].filename,
                        product.productRightImage = url + '/productimages/' + files.productRightImage[0].filename,
                    product.productBriefDesc = data.productBriefDesc,
                    product.productDetailDesc = data.productDetailDesc,
                    product.productSpec = data.productSpec,
                    product.brand =  data.brand,
                    product.location = data.location,
                    product.quantity = data.quantity,
                    product.price = data.price,
                    product.expires = data.expires,
                    product.salePrice =  data.salePrice,
                    product.status = data.status,
                    product.dateModified = new Date(),
                    product.colors = data.colors,
                    product.sizes = data.sizes,
                    product.tags = data.tags,
                    product.salePrice = data.salePrice,
                    product.sizessize = data.sizes,
                    product. colors = data.colors,
                    product.tags = data.tags
                    product.save();
                return product;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
        });
    }


    updateProductLike(req, callback) {

        console.log("Reaching Likes");
        let data = req.body;
        let validator = this._validator;
        // req.checkBody(ProductHandler.LIKE_PRODUCT_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ProductModel.findOne({ _id: req.params.id }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                resolve(product);
                            }
                        }
                    })
                });
            })
            .then((product) => {
                // console.log(data.cooperId)
              let products = product.likes.filter(function(like) {
                    console.log(like.cooperId);
                 
                  return like.cooperId === data.cooperId;

                }) 
            console.log(products.length > 0)
            console.log(products)
                if (products.length > 0) {
                    product.likesCount -= 1;
                    console.log('this is data ' + data.cooperId)
                    product.likes.pop({
                        cooperId: data.cooperId
                    });
                } else {
                    console.log('data is not here')
                    if (product.likesCount) {
                        product.likesCount += 1;
                    } else {
                        product.likesCount = 1;
                    }

                    product.dateModified = new Date();
                    product.likes.push({
                        cooperId: data.cooperId
                    });
                }


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



    getAllProductLikes(req, callback) {

        console.log("Reaching Likes");
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid Cooper ID Provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {

                    var cooperId = req.params.id;
                    var cooperId2 = cooperId.toString();
                    
                    ProductModel.find({ "likes.cooperId": cooperId2 }, function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                resolve(product);
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

    getAllProductByBrand(req, callback) {

        console.log("Reaching Likes");
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid Cooper ID Provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {

                   
                    ProductModel.find({ brand: req.params.id }, function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                resolve(product);
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


    getAllProductByBrandName(req, callback) {

        console.log("Reaching Likes");
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid Cooper ID Provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {


                    ProductModel.find({}, function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                resolve(product);
                            }
                        }
                    })
                    .select('brand')
                });
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }




    getAllProductRates(req, callback) {

        console.log("Reaching Likes");
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid Cooper ID Provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {

                    var cooperId = req.params.id;
                    var cooperId2 = cooperId.toString();

                    ProductModel.find({ "rates.cooperId": cooperId2 }, function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                resolve(product);
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

    getAllProductRatesCount(req, callback) {

        console.log("Reaching Likes");
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid Cooper ID Provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {

                    var cooperId = req.params.id;
                    var cooperId2 = cooperId.toString();

                    ProductModel.where({ "rates.cooperId": cooperId2 }).count( function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                resolve(product);
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

    getRatesByProductId(req, callback) {

        console.log("Reaching Likes");
        let data = req.body;
        let validator = this._validator;
        req.checkParams('id', 'Invalid Cooper ID Provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {

                    // var cooperId = req.params.id;
                    // var cooperId2 = cooperId.toString();
                    // var rateParam = req.params.id;

                    var likeReq = req.params.id
                    // console.log(likeReq);
                    var val = mongoose.Types.ObjectId(likeReq);
                    ProductModel.aggregate([{ $match: { _id: val  } }, { $project: { count: { $size: "$rates" } } }], function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                resolve(product);
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


    updateProductRate(req, callback) {

        console.log("Reaching Likes");
        let data = req.body;
        let validator = this._validator;
        // req.checkBody(ProductHandler.LIKE_PRODUCT_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ProductModel.findOne({ _id: req.params.id }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                resolve(product);
                            }
                        }
                    })
                });
            })
            .then((product) => {

            
                    product.rates.push({
                        cooperId: req.body.cooperId,
                        rate: req.body.rate
                    });
                
            

                //    product.rates.push({
                //        rate: 1
                //    })
                


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




    deductProduct(req, userToken, callback) {
        console.log("reaching deduct");
        let data = req.body;
        let dataApi = req.body;
        let validator = this._validator;
        req.checkBody(ProductHandler.DEDUCT_PRODUCT_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                if (userToken.cooperId !== data.cooperId) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                return new Promise(function(resolve, reject) {


                    ProductModel.findOne({ _id: data.productId }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("product not found"));
                            } else {

                                if(product.quantity === 0 || data.quantity > product.quantity){
                                    reject(new NotFoundError("product quantity low"));  
                                } else {

                                    product.quantity -= validator.trim(data.quantity);
                                    if (product.quantitySold) {

                                        product.quantitySold += 1;
                                    } else {

                                        product.quantitySold = 1;
                                    }

                                    product.dateModified = new Date();
                                    product.save();


                                    let totalAmount = product.price * data.quantity;

                                    var batchId = Math.floor(Math.random() * 9000000000) + 1000000000;

                                    resolve(new TransactionModel({
                                        staffId: data.staffId,
                                        cooperativeId: validator.trim(data.cooperativeId),
                                        cooperId: validator.trim(data.cooperId),
                                        transAmount: totalAmount,
                                        unitAmount: product.price,
                                        batchId: batchId,
                                        vendorId: product.vendorId,
                                        productId: product.productId,
                                        product: product._id,
                                        productStatus: "Ok",
                                        quantity: validator.trim(data.quantity),
                                        contactadd: data.contactadd,
                                        city: data.city,
                                        phoneNo: data.phoneNo,
                                        // cooperativeTranId: "33455666",
                                        status: "Success"


                                    }));
                                }

                            }
                        }
                    })
                });
            }
            })
            .then((product) => {

                product.save();




                return product;
            })
            .then((trans) => {

                console.log("Trans Model " + JSON.stringify(trans));

                callback.onSuccess(trans);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getSingleProduct(req, callback) {
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
                    ProductModel.findOne({ _id: req.params.id }, function(err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                                console.log("User ID " + req.params.userId);



                                var productview = new ProductViewModel({
                                    userId: req.params.userId,
                                    productId: req.params.id,
                                    product: req.params.id,
                                });

                                // save model to database
                                productview.save(function(err, proview) {
                                    if (err) return console.error(err);
                                    console.log(proview.productId + " saved to bookstore collection.");
                                });



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


    // getProductByVendorId(req, callback) {
    //     console.log("Reaching Single Product " + req.params.id);
    //     let data = req.body;
    //     req.checkParams('id', 'Invalid Product provided');
    //     req.getValidationResult()
    //         .then(function (result) {
    //             if (!result.isEmpty()) {
    //                 let errorMessages = result.array().map(function (elem) {
    //                     return elem.msg;
    //                 });
    //                 throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
    //             }
    //             return new Promise(function (resolve, reject) {
    //                 ProductModel.find({ vendorId: req.params.id }, function (err, product) {
    //                     if (err !== null) {
    //                         reject(err);
    //                     } else {
    //                         if (!product) {
    //                             reject(new NotFoundError("Product not found"));
    //                         } else {


    //                             resolve(product);
    //                         }
    //                     }
    //                 })
    //             });
    //         })
    //         .then((post) => {

    //             console.log("Single Product Found " + post);
    //             callback.onSuccess(post);
    //         })
    //         .catch((error) => {
    //             callback.onError(error);
    //         });
    // }

    
//                     var curr = new Date; // get current date
// var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
// var last = first + 6; // last day is the first day + 6

// var firstday = new Date(curr.setDate(first));
// var lastday = new Date(curr.setDate(last));

// ProductModel.find({ status: req.params.id, "dateModified": { "$gte": new Date(firstday), "$lt": new Date(lastday) } }, function (err, product) {


    getNewProduct(req, callback) {
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

                    ProductModel.find({"dateModified": { "$gte": new Date(firstday), "$lt": new Date(lastday) }  }, function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {
                            

                                resolve(product);
                            }
                        }
                    })
                    .sort('dateModified -1')
                });
            })
            .then((post) => {

                callback.onSuccess(post);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getProductByStatus(req, callback) {
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
                    ProductModel.find({ status: req.params.id }, function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {


                                resolve(product);
                            }
                        }
                    })
                });
            })
            .then((post) => {

                callback.onSuccess(post);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }




    getProductByVendorId(req, callback) {
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
                    let vendorId = req.params.id;
                    ProductModel.aggregate([
                        {
                            $match: { vendorId: vendorId }
                        },

                     

                        // {
                        //     $project: { 'productName': 1}
                        // }
                    ], function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {


                                resolve(product);
                            }
                        }
                    })
                });
            })
            .then((post) => {

                callback.onSuccess(post);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }



    getProductOnSale(req, callback) {
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

                    ProductModel.find({ status: req.params.id, "dateModified": { "$gte": new Date(firstday), "$lt": new Date(lastday)} }, function (err, product) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!product) {
                                reject(new NotFoundError("Product not found"));
                            } else {


                                resolve(product);
                            }
                        }
                    })
                });
            })
            .then((post) => {

                callback.onSuccess(post);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }



    getAllProduct(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                ProductModel.find({}, function(err, posts) {
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

    getSuggestedProduct(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
            ProductModel.aggregate([{ $sample: { size: 20 } }
            ], function(err, posts) {
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

    searchProduct(req, callback) {

        let data = req.body;
        //check body for searchValue and skipValue and limitValue
        new Promise(function(resolve, reject) {


                // ProductModel.find({}, function(err, posts) {
                //     if (err !== null) {
                //         reject(err);
                //     } else {
                //         resolve(posts);
                //     }
                // });

                console.log("Search Text " + data.searchValue.toLowerCase());

                // db.users.find({"name": /.*m.*/})

                var query = ProductModel.find({ "productName": new RegExp('^.*' + data.searchValue.toLowerCase(), "i") });
                //var query = ProductModel.find({ "productName": new RegExp('.*' + data.searchValue.toLowerCase(), ".*i") });
                query.skip(data.skipValue).limit(data.limitValue);

                query.exec(function(err, products) {
                    // called when the `query.complete` or `query.error` are called
                    // internally


                    if (err !== null) {
                        reject(err);
                    } else {
                        if (!products) {
                            reject(new NotFoundError("Token not found"));
                        } else {
                            console.log("Fetch data " + JSON.stringify(products));
                            resolve(products);
                        }
                    }
                });

            })
            .then((products) => {
                callback.onSuccess(products);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}



function sendEmail(emailLinks, emailaddress, firstName, transAmount, userMode) {

    //nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        name: 'mail.cooperswitch.com',
        host: 'mail.cooperswitch.com',
        port: 26,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'info@cooperswitch.com', // generated ethereal user
            pass: 'Accelerar@@1234' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    if (userMode === 'Vendor') {

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Cooper Switch" <info@cooperswitch.com>', to: `${emailaddress // sender address
                }`, subject: "Transaction Details",  // list of receivers // Subject line
            html: `


            Hi ${firstName}, <br/>
            <p><h2> Your product(s) were just sold <h2><p>
            <p>One or more of your products were just sold on CooperSwitch to the tune of N ${transAmount}</p>
      
           <p>Thanks,</p><br/>
           <p>Team CooperSwitch</p>'` }; // html body

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log(info)
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
        // });


    } else if (userMode === 'Cooperator') {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Cooper Switch" <info@cooperswitch.com>', to: `${emailaddress // sender address
                }`, subject: "Payment Notification",  // list of receivers // Subject line
            html: `


            Hi ${firstName}, <br/>
            <p><h2> Your payment was successful <h2><p>
            <p> You have successfully paid for product worth ${transAmount}. <p>
            <p>Thank you for making a purchase with CooperSwitch.</p>
           <p>Team CooperSwitch</p>'` }; // html body

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
        // });

    }

}

module.exports = ProductHandler;