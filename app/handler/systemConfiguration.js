/**
 *  Created by Accelerar on 3/6/2018.
 */
const SystemConfigurationModel = require(APP_MODEL_PATH + 'systemConfiguration').SystemConfigurationModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class SystemConfigurationHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_SYSTEM_CONFIGURATION_SCHEMA() {
        return {
            'systemConfigId': {
                notEmpty: true,

                errorMessage: 'Invalid System Id'
            },

        };
    }

    createSystemConfiguration(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(SystemConfigurationHandler.VERIFY_SYSTEM_CONFIGURATION_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }




                return new SystemConfigurationModel({

                    systemConfigId: validator.trim(data.systemConfigId),
                    sessionTime: validator.trim(data.sessionTime),
                    status: "Active"



                });
            })
            .then((systemConfiguration) => {
                systemConfiguration.save();
                return systemConfiguration;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deletesystemConfiguration(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid System Config Id').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    SystemConfigurationModel.findOne({ _id: req.params.id }, function(err, systemConfiguration) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!systemConfiguration) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(systemConfiguration);
                            }
                        }
                    })
                });
            })
            .then((systemConfiguration) => {
                systemConfiguration.remove();
                return systemConfiguration;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updatesystemConfiguration(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(SystemConfigurationHandler.VERIFY_SYSTEM_CONFIGURATION_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    SystemConfigurationModel.findOne({ _id: req.params.id }, function(err, systemConfiguration) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!systemConfiguration) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(systemConfiguration);
                            }
                        }
                    })
                });
            })
            .then((systemConfiguration) => {
                systemConfiguration.status = validator.trim(data.status);
                systemConfiguration.sessionTime = validator.trim(data.sessionTime);
                systemConfiguration.dateModified = new Date();
                systemConfiguration.save();
                return systemConfiguration;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSinglesystemConfiguration(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid System Id provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    SystemConfigurationModel.findOne({ _id: req.params.id }, function(err, systemConfiguration) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!systemConfiguration) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(systemConfiguration);
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



    getSystemConfigFirstRecord(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                var query = SystemConfigurationModel.find({});


                query.limit(1);


                query.exec(function(err, systemConfiguration) {
                    // called when the `query.complete` or `query.error` are called
                    // internally


                    if (err !== null) {
                        reject(err);
                    } else {
                        if (!systemConfiguration) {
                            reject(new NotFoundError("Token not found"));
                        } else {
                            resolve(systemConfiguration);
                        }
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


    getAllcomplaint(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                SystemConfigurationModel.find({}, function(err, systemConfiguration) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(systemConfiguration);
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

module.exports = SystemConfigurationHandler;