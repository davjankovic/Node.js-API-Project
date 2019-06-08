/**
 *  Created by Accelerar on 3/6/2018.
 */
const CooperativeStaffModel = require(APP_MODEL_PATH + 'cooperativeStaff').CooperativeStaffModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class CooperativeStaffHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_COOPERATIVE_STAFF_SCHEMA() {
        return {
            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative Id'
            },
            'staffId': {
                notEmpty: true,
                errorMessage: "Invalid staff Id"
            }
        };
    }

    createCooperativeStaff(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(CooperativeStaffHandler.VERIFY_COOPERATIVE_STAFF_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }




                return new CooperativeStaffModel({
                    staffId: validator.trim(data.staffId),
                    cooperativeId: validator.trim(data.cooperativeId),
                    name: validator.trim(data.name),
                    phone: validator.trim(data.phone),
                    email: validator.trim(data.email),
                    address: validator.trim(data.address),
                    levels: validator.trim(data.levels),
                    status: "Active"



                });
            })
            .then((cooperativeStaff) => {
                cooperativeStaff.save();
                return cooperativeStaff;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deletecooperativeStaff(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Staff Id').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    CooperativeStaffModel.findOne({ _id: req.params.id }, function(err, cooperativeStaff) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cooperativeStaff) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(cooperativeStaff);
                            }
                        }
                    })
                });
            })
            .then((cooperativeStaff) => {
                cooperativeStaff.remove();
                return cooperativeStaff;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updatecooperativeStaff(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(CooperativeStaffHandler.VERIFY_COOPERATIVE_STAFF_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    CooperativeStaffModel.findOne({ _id: req.params.id }, function(err, cooperativeStaff) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cooperativeStaff) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(cooperativeStaff);
                            }
                        }
                    })
                });
            })
            .then((cooperativeStaff) => {
                cooperativeStaff.status = validator.trim(data.status);
                cooperativeStaff.name = validator.trim(data.name);
                cooperativeStaff.phone = validator.trim(data.phone);
                cooperativeStaff.email = validator.trim(data.email);
                cooperativeStaff.address = validator.trim(data.address);
                cooperativeStaff.levels = validator.trim(data.levels);
                cooperativeStaff.dateModified = new Date();
                cooperativeStaff.save();
                return cooperativeStaff;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSinglecooperativeStaff(req, callback) {
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
                    CooperativeStaffModel.findOne({ _id: req.params.id }, function(err, cooperativeStaff) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cooperativeStaff) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(cooperativeStaff);
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

    getVerifyCooperativeStaff(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Staff Id provided');
        req.checkParams('cooperativeId', 'Invalid CooperativeId provided');
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {

                    CooperativeStaffModel.findOne({ staffId: req.params.id, cooperativeId: req.params.cooperativeId }, function(err, cooperativeStaff) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cooperativeStaff) {
                                reject(new NotFoundError("Staff not found"));
                            } else {
                                resolve(cooperativeStaff);
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

    getAllcooperativeStaff(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                CooperativeStaffModel.find({}, function(err, cooperativeStaff) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(cooperativeStaff);
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

module.exports = CooperativeStaffHandler;