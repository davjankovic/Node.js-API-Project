/**
 *  Created by Accelerar on 3/6/2018.
 */
const ComplaintModel = require(APP_MODEL_PATH + 'complaints').ComplaintModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

var multer = require('multer');


class ComplaintHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_COMPLAINT_SCHEMA() {
        return {
            'cooperId': {
                notEmpty: true,

                errorMessage: 'Invalid Complaint Id'
            },

        };
    }

    createComplaint(req, callback, res) {

        // console.log("Files " + req.file);
        // console.log("Message " + req.body.message);
        // console.log("File Uploaded  " + req.body.image);

        console.log("Reaching File Upload");

        var filenameConcat = "";


        var Storage = multer.diskStorage({
            destination: function(req, file, callback) {
                callback(null, "public/issuesimages");
            },
            filename: function(req, file, callback) {

                filenameConcat = file.fieldname + "_" + Date.now() + "_" + file.originalname;
                callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            }
        });

        var upload = multer({ storage: Storage }).single("image"); //Field name and max count
        var _that = this;
        upload(req, res, function(err) {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }

            // console.log("Reaching Upload Success " + req.file);
            // return res.end("File uploaded sucessfully!.");




            console.log("Message " + req.params.message);

            let data = req.body;
            let validator = _that._validator;
            // req.checkBody(ComplaintHandler.VERIFY_COMPLAINT_SCHEMA);
            req.getValidationResult()
                .then(function(result) {
                    if (!result.isEmpty()) {
                        let errorMessages = result.array().map(function(elem) {
                            return elem.msg;
                        });
                        throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                    }




                    console.log("Success Body ");
                    const url = req.protocol + '://' + req.get('host');

                    return new ComplaintModel({

                        cooperId: data.cooperId,
                        subject: data.subject,
                        message: data.message,
                        image: url + '/issuesimages/' + filenameConcat,
                        cooperativeId: data.cooperativeId,
                        vendorId: data.vendorId,
                        name: data.name,
                        email: data.email,


                        status: "pending"



                    });

                    // res.send('File uploaded!');




                })
                .then((complaint) => {
                    console.log("Returned " + JSON.stringify(complaint));
                    complaint.save();
                    return complaint;
                })
                .then((saved) => {
                    callback.onSuccess(saved);
                })
                .catch((error) => {
                    callback.onError(error);
                });

        });
    }


    createCooperatorComplaint(req, callback, res) {

        // console.log("Files " + req.file);
        // console.log("Message " + req.body.message);
        // console.log("File Uploaded  " + req.body.image);

        console.log("Reaching File Upload");

        var filenameConcat = "";


        var Storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, "public/issuesimages");
            },
            filename: function (req, file, callback) {

                filenameConcat = file.fieldname + "_" + Date.now() + "_" + file.originalname;
                callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            }
        });

        var upload = multer({ storage: Storage }).single("image"); //Field name and max count
        var _that = this;
        upload(req, res, function (err) {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }

            // console.log("Reaching Upload Success " + req.file);
            // return res.end("File uploaded sucessfully!.");




            console.log("Message " + req.params.message);

            let data = req.body;
            let validator = _that._validator;
            // req.checkBody(ComplaintHandler.VERIFY_COMPLAINT_SCHEMA);
            req.getValidationResult()
                .then(function (result) {
                    if (!result.isEmpty()) {
                        let errorMessages = result.array().map(function (elem) {
                            return elem.msg;
                        });
                        throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                    }




                    console.log("Success Body ");
                    const url = req.protocol + '://' + req.get('host');

                    return new ComplaintModel({

                        cooperId: data.cooperId,
                        subject: data.subject,
                        message: data.message,
                        image: url + '/issuesimages/' + filenameConcat,
                        cooperativeId: data.cooperativeId,
                        cooperId: data.cooperId,
                        name: data.name,
                        email: data.email,


                        status: "pending"



                    });

                    // res.send('File uploaded!');




                })
                .then((complaint) => {
                    console.log("Returned " + JSON.stringify(complaint));
                    complaint.save();
                    return complaint;
                })
                .then((saved) => {
                    callback.onSuccess(saved);
                })
                .catch((error) => {
                    callback.onError(error);
                });

        });
    }


    deletecomplaint(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Complaint Id').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ComplaintModel.findOne({ _id: req.params.id }, function(err, complaint) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!complaint) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(complaint);
                            }
                        }
                    })
                });
            })
            .then((complaint) => {
                complaint.remove();
                return complaint;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updatecomplaint(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(ComplaintHandler.VERIFY_COOPERATIVE_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ComplaintModel.findOne({ _id: req.params.id }, function(err, complaint) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!complaint) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(complaint);
                            }
                        }
                    })
                });
            })
            .then((complaint) => {
                complaint.status = validator.trim(data.status);
                complaint.subject = validator.trim(data.subject);
                complaint.message = validator.trim(data.message);
                complaint.image = validator.trim(data.image);
                complaint.action = validator.trim(data.action);
                complaint.dateModified = new Date();
                complaint.save();
                return complaint;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSinglecomplaint(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Complaint provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    ComplaintModel.findOne({ _id: req.params.id }, function(err, complaint) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!complaint) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(complaint);
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



    getSingleComplaintByCooperId(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Cooper Id provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    ComplaintModel.find({ cooperId: req.params.id }, function (err, complaint) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!complaint) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(complaint);
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


    getSingleComplaintByVendorId(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Vendor Id provided');
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    ComplaintModel.find({ vendor: req.params.id }, function (err, complaint) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!complaint) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(complaint);
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


    getAllcomplaint(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                ComplaintModel.find({}, function(err, complaint) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(complaint);
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


    complaintsByStatus(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Status provided');

        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {

                    ComplaintModel.find({ status: req.params.id }, function(err, complaint) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            resolve(complaint);
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

}

module.exports = ComplaintHandler;