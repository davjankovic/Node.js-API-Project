/**
 *  Created by Accelerar on 3/6/2018.
 */
// const CooperativeModel = require(APP_MODEL_PATH + 'cooperative').CooperativeModel;
const LimitIncreaseModel = require(APP_MODEL_PATH + 'limitincrease').LimitIncreaseModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
const multer = require('multer');
const validator = require('validator');
class LimitIncreaseHandler extends BaseAutoBindedClass {
    constructor() {
        super();
       
    }

    static get VERIFY_LIMITINCREASE_SCHEMA() {
        return {
            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative Id'
            },
            'cooperId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooper Id'
            },
            'email': {
                notEmpty: true,

                errorMessage: 'Invalid email'
            },
        };
    }

    createLimitIncrease(req, callback, res) {


        console.log("Reaching File Upload");

        var filenameConcat = "";


        var Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "public/limitincrease");
            },
            filename: function (req, file, callback) {

                filenameConcat = file.fieldname + "_" + Date.now() + "_" + file.originalname;
                callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            }
        });

        var upload = multer({ storage: Storage }).single("fileAttach"); //Field name and max count
       
        upload(req, res, function (err) {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }
        let data = req.body;

        req.checkBody(LimitIncreaseHandler.VERIFY_LIMITINCREASE_SCHEMA);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }



                const url = req.protocol + '://' + req.get('host');
                return new LimitIncreaseModel({

                    cooperativeId: validator.trim(data.cooperativeId),
                    cooperId: validator.trim(data.cooperId),
                    email: validator.trim(data.email),
                    limit: validator.trim(data.limit),
                    fileAttach: url + '/limitincrease/' + filenameConcat,
                    status: "Pending"



                });
            })
            .then((limit) => {
                limit.save();
                return limit;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });

        });
    }

    deleteLimitIncrease(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Cooper Id').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    LimitIncreaseModel.findOne({ _id: req.params.id }, function (err, limit) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!limit) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(limit);
                            }
                        }
                    })
                });
            })
            .then((cooperative) => {
                cooperative.remove();
                return cooperative;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateLimitIncrease(req, callback, res) {

        console.log("Reaching File Upload");

        var filenameConcat = "";


        var Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "public/limitincrease");
            },
            filename: function (req, file, callback) {

                filenameConcat = file.fieldname + "_" + Date.now() + "_" + file.originalname;
                callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            }
        });

        var upload = multer({ storage: Storage }).single("fileAttach"); //Field name and max count

        upload(req, res, function (err) {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }
        let data = req.body;
      
        req.checkBody(LimitIncreaseHandler.VERIFY_LIMITINCREASE_SCHEMA);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    LimitIncreaseModel.findOne({ _id: req.params.id }, function (err, limit) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!limit) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(limit);
                            }
                        }
                    })
                });
            })
            .then((limit) => {

                const url = req.protocol + '://' + req.get('host');

                limit.status = validator.trim(data.status);
                limit.cooperativeId = validator.trim(data.cooperativeId),
                limit.cooperId = validator.trim(data.cooperId),
                limit.email = validator.trim(data.email),
                limit.limit = validator.trim(data.limit),
                limit.fileAttach = url + '/limitincrease/' + filenameConcat,
                limit.dateModified = new Date();
                limit.save();
                return limit;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
        });
    }

    getSingleLimitIncrease(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid limit increase provided').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    let cooperId = req.params.cooperId;
                    LimitIncreaseModel.findOne({ _id: req.params.id, cooperId: cooperId}, function (err, limit) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!limit) {
                                reject(new NotFoundError("CooperId not found"));
                            } else {
                                resolve(limit);
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



    getLimitIncrease(req, callback) {
        let data = req.body;
        // req.checkParams('id', 'Invalid limit increase provided').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    let cooperId = req.params.cooperId;
                    LimitIncreaseModel.find({ cooperativeId: req.params.id, cooperId: cooperId }, function (err, limit) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!limit) {
                                reject(new NotFoundError("CooperId not found"));
                            } else {
                                resolve(limit);
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

    getLimitIncreaseAdmin(req, callback) {
        let data = req.body;
        // req.checkParams('id', 'Invalid limit increase provided').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    let cooperId = req.params.id;
                    LimitIncreaseModel.find({ cooperId: cooperId }, function (err, limit) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!limit) {
                                reject(new NotFoundError("CooperId not found"));
                            } else {
                                resolve(limit);
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

    getAllLimitIncrease(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
           LimitIncreaseModel.find({}, function (err, limit) {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(limit);
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

module.exports = LimitIncreaseHandler;