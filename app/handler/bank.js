/**
 *  Created by Accelerar on 3/6/2018.
 */
const BankModel = require(APP_MODEL_PATH + 'Bank').BankModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class BankHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_BANK_SCHEMA() {
        return {
            'bankName': {
                notEmpty: true,

                errorMessage: 'Invalid Bank Name'
            },

        };
    }

    createBank(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(BankHandler.VERIFY_BANK_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }




                return new BankModel({

                    bankName: validator.trim(data.bankName)

                });
            })
            .then((bank) => {
                bank.save();
                return bank;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteBank(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Bank Id').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    BankModel.findOne({ _id: req.params.id }, function(err, bank) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!bank) {
                                reject(new NotFoundError("Bank not found"));
                            } else {
                                resolve(bank);
                            }
                        }
                    })
                });
            })
            .then((bank) => {
                bank.remove();
                return bank;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateBank(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(BankHandler.VERIFY_BANK_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    BankModel.findOne({ _id: req.params.id }, function(err, bank) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!bank) {
                                reject(new NotFoundError("Bank not found"));
                            } else {
                                resolve(bank);
                            }
                        }
                    })
                });
            })
            .then((bank) => {

                bank.bankName = validator.trim(data.bankName);

                bank.dateModified = new Date();
                bank.save();
                return bank;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleBank(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Cooperative provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    BankModel.findOne({ _id: req.params.id }, function(err, bank) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!bank) {
                                reject(new NotFoundError("Bank not found"));
                            } else {
                                resolve(bank);
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

    getAllBanks(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                BankModel.find({}, function(err, bank) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(bank);
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

module.exports = BankHandler;