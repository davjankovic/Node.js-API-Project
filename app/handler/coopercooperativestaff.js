/**
 *  Created by Accelerar on 3/25/2018.
 */
const CooperCooperativeStaffModel = require(APP_MODEL_PATH + 'coopercooperativestaff').CooperCooperativeStaffModel;
const CooperativeStaffAccountsModel = require(APP_MODEL_PATH + 'cooperativeStaffAccounts').CooperativeStaffAccountsModel;
const CooperativeModel = require(APP_MODEL_PATH + 'cooperative').CooperativeModel;
const CooperativeAPIModel = require(APP_MODEL_PATH + 'cooperativeAPI').CooperativeAPIModel;
const UnauthorizedError = require(APP_ERROR_PATH + "unauthorized");
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
var Client = require('node-rest-client').Client;
var client = new Client();
class CooperCooperativeStaffHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_CooperCooperativeStaff_SCHEMA() {
        return {
            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative Id'
            },
            'staffId': {
                notEmpty: true,

                errorMessage: 'Invalid Staff Id'
            },
            'cooperId': {
                notEmpty: true,

                errorMessage: 'Invalid Staff Id'
            }


        };
    }

    createCooperCooperativeStaff(req, userToken, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(CooperCooperativeStaffHandler.VERIFY_CooperCooperativeStaff_SCHEMA);
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
                   
                    let cooperativeId = data.cooperativeId
        
                    CooperativeModel.findOne({ cooperativeId: cooperativeId }, function (err, cooperative) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cooperative) {
                                reject(new NotFoundError("Cooperative not found"));
                            } else {

                                resolve(cooperative);


                            }
                        }
                    });
                });
              
            }



            })
            .then((coo) => {
                return new Promise((resolve, reject) => {
                         CooperCooperativeStaffModel.findOne({ cooperativeId: data.cooperativeId, staffId: data.staffId, cooperId: data.cooperId }, function(err, coocoo) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!coocoo) {

                                resolve(new CooperCooperativeStaffModel({

                                    cooperativeId: validator.trim(data.cooperativeId),
                                    staffId: validator.trim(data.staffId),
                                    cooperId: validator.trim(data.cooperId),
                                    first_name: coo.first_name





                                }));


                            } else {
                                reject(new NotFoundError("Cooper Cooperative Exist"));
                            }
                        }
                    })

                    // CooperativeModel.find({ cooperativeId: data.cooperativeId, staffId: data.staffId, cooperId: data.cooperId }, function (err, coo) {
                    //     if (err !== null) {
                    //         reject(err);
                    //     } else {

                    //         if (!coo) {
                    //             reject(new NotFoundError("Cooper Cooperative Does not Exist"));
                    //         } else {

                    //             console.log(coo.cooperativeId);
                    //             resolve(new CooperCooperativeStaffModel({

                    //                 cooperativeId: validator.trim(data.cooperativeId),
                    //                 staffId: validator.trim(data.staffId),
                    //                 cooperId: validator.trim(data.cooperId),
                    //                 first_name: coo.first_name





                    //             }));
                    //         }



                    //     }

                    // })



                })
            })
            .then((coo) => {
                coo.save();
                return coo;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deleteCooperCooperativeStaff(req, callback) {
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
                    CooperCooperativeStaffModel.findOne({ _id: req.params.id }, function(err, coocoo) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!coocoo) {
                                reject(new NotFoundError("Cooper Cooperative Staff is not found"));
                            } else {
                                resolve(coocoo);
                            }
                        }
                    })
                });
            })
            .then((coocoo) => {
                coocoo.remove();
                return coocoo;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateCooperCooperativeStaff(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(CooperCooperativeStaffHandler.VERIFY_CooperCooperativeStaff_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    CooperCooperativeStaffModel.findOne({ _id: req.params.id }, function(err, coocoo) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!coocoo) {
                                reject(new NotFoundError("Cooper Cooperative Staff is not found"));
                            } else {
                                resolve(coocoo);
                            }
                        }
                    })
                });
            })
            .then((coocoo) => {

                coocoo.cooperativeId = validator.trim(data.cooperativeId);
                coocoo.staffId = validator.trim(data.staffId);
                coocoo.cooperId = validator.trim(data.cooperId);
                coocoo.accounttype = validator.trim(data.accounttype);
                coocoo.dateModified = new Date();
                coocoo.email = validator.trim(data.accounttype)
                coocoo.save();
                return coocoo;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllCooperCooperativeStaffByCooperId2(req, userToken, callback) {

        console.log("Reaching top model up");
        let data = req.body;
        let dataAPI = req.body;
        req.checkParams('id', 'Invalid Cooper Id provided');

        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                if (userToken.cooperId !== req.params.id) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                return new Promise(function(resolve, reject) {
                    let cooperate = data.cooperativeId;
                    let staff = data.staffId;
                    CooperCooperativeStaffModel.findOne({cooperId: req.params.id, cooperativeId: cooperate, staffId: staff},
                      function(err, coocoo) {
                        if (err !== null) {
                          reject(err);
                        } else {
                          if (!coocoo) {
                        
                            reject(
                      
                              new NotFoundError(
                                "Cooper Cooperative Staff is not found"
                              )
                            );
                          } else {
                            console.log(
                              "Reaching top models"
                            );

                                    
                            resolve(coocoo);
                          }
                        }
                      }
                    );
                });
            }
            })
            .then((coocoo) => {

                return new Promise(function(resolve, reject) {
                    console.log('this is co ' + coocoo)

        
                        // console.log('this is ' + cooperativeApi.cooperativeId)

                        CooperativeAPIModel.findOne({ cooperativeId: coocoo.cooperativeId }, function (err, cooperative) {

                            if (err !== null) {
                                reject(err);
                            } else {
                                if (!cooperative) {
                                    reject(new NotFoundError("Staff not found"));
                                } else {
                                    var args = {
                                        data: { grant_type: 'password', username: cooperative.apiAuthorization.username, password: cooperative.apiAuthorization.password },
                                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                                    };
                                    let urlapi = cooperative.apiAuthorization.url;

                                    client.post("" + urlapi + "", args, function (data, response) {
                                        // parsed response body as js object
                                        console.log("Data from Cooplag " + JSON.stringify(data));
                                        // raw response
                                        console.log('Response from Cooplag' + response);


                                        if (data !== null) {
                                            var args = {

                                                headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                                            };

                                            let validUrl = cooperative.validateMember.url;

                                            client.get("" + validUrl + "" + dataAPI.staffId, args, function (data, response) {
                                                // parsed response body as js object
                                                console.log("Member Data from Cooplag " + JSON.stringify(data));

                                                if (data.Message === 'Member Account is Valid') {

                                                    resolve(data);
                                                } else {
                                                    reject(new NotFoundError("Staff not found"));
                                                }
                                                // raw response
                                                console.log('Response from Cooplag' + response);
                                            }).on('error', function (err) {
                                                console.log('something went wrong on the request');
                                            });

                                            // handling client error events
                                            client.on('error', function (err) {
                                                console.error('Something went wrong on the client', err);
                                            });
                                        }

                                    }).on('error', function (err) {
                                        console.log('something went wrong on the request');
                                    });

                                    // handling client error events
                                    client.on('error', function (err) {
                                        console.error('Something went wrong on the client', err);
                                    });

                                    // resolve(cooperative);
                                }
                            }

                        })
                 
                
                })
                      
            })
           
            .then((saved) => {

                // console.log("Got Data After precessing " + JSON.stringify(saved));
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    ussdCheckBalance(req, callback) {

        console.log("Reaching top model up");
        let data = req.body;
        let dataAPI = req.body;
        req.checkParams('id', 'Invalid Cooper Id provided');

        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function(resolve, reject) {
                    let cooperate = req.query.cooperativeId;
                    let staff = req.query.staffId;
                    let cooperId = req.query.cooperId
                    console.log('this is params ' + cooperate, staff, cooperId)
                    CooperCooperativeStaffModel.findOne({cooperId: cooperId, cooperativeId: cooperate, staffId: staff},
                      function(err, coocoo) {
                        if (err !== null) {
                          reject(err);
                        } else {
                          if (!coocoo) {
                        
                            reject(
                      
                              new NotFoundError(
                                "Cooper Cooperative Staff is not found"
                              )
                            );
                          } else {
                            console.log(
                              "Reaching top models"
                            );

                                console.log(coocoo)    
                            resolve(coocoo);
                          }
                        }
                      }
                    );
                });
            
            })
            .then((coocoo) => {

                return new Promise(function(resolve, reject) {
                    console.log('this is co ' + coocoo)

        
                        // console.log('this is ' + cooperativeApi.cooperativeId)

                        CooperativeAPIModel.findOne({ cooperativeId: coocoo.cooperativeId }, function (err, cooperative) {

                            if (err !== null) {
                                reject(err);
                            } else {
                                if (!cooperative) {
                                    reject(new NotFoundError("Staff not found"));
                                } else {
                                   
                                    var args = {
                                        data: { grant_type: 'password', username: cooperative.apiAuthorization.username, password: cooperative.apiAuthorization.password },
                                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                                    };
                                    let urlapi = cooperative.apiAuthorization.url;

                                    client.post("" + urlapi + "", args, function (data, response) {
                                        // parsed response body as js object
                                        console.log("Data from Cooplag " + JSON.stringify(data));
                                        // raw response
                                        console.log('Response from Cooplag' + response);


                                        if (data !== null) {
                                            var args = {

                                                headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                                            };

                                            let validUrl = cooperative.validateMember.url;
                                     
                                            client.get("" + validUrl + "" + req.query.staffId, args, function (data, response) {
                                                // parsed response body as js object
                                                console.log("Member Data from Cooplag " + JSON.stringify(data));

                                                if (data.Message === 'Member Account is Valid') {

                                                    resolve(data);
                                                } else {
                                                    reject(new NotFoundError("Staff not found"));
                                                }
                                                // raw response
                                                console.log('Response from Cooplag' + response);
                                            }).on('error', function (err) {
                                                console.log('something went wrong on the request');
                                            });

                                            // handling client error events
                                            client.on('error', function (err) {
                                                console.error('Something went wrong on the client', err);
                                            });
                                        }

                                    }).on('error', function (err) {
                                        console.log('something went wrong on the request');
                                    });

                                    // handling client error events
                                    client.on('error', function (err) {
                                        console.error('Something went wrong on the client', err);
                                    });

                                    // resolve(cooperative);
                                }
                            }

                        })
                 
                
                })
                      
            })
           
            .then((saved) => {

                // console.log("Got Data After precessing " + JSON.stringify(saved));
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    // getAllAccountBalances(req, callback) {

    //     console.log("Reaching top model up");
    //     let data = req.body;
    //     req.checkParams('id', 'Invalid Cooper Id provided');

    //     req.getValidationResult()
    //         .then(function(result) {
    //             if (!result.isEmpty()) {
    //                 let errorMessages = result.array().map(function(elem) {
    //                     return elem.msg;
    //                 });
    //                 throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
    //             }
    //             return new Promise(function(resolve, reject) {
    //                 let cooperate = data.cooperativeId;
    //                 let staff = data.staffId;
    //                 CooperCooperativeStaffModel.aggregate(
    //                   [
    //                     {
    //                       $match: {
    //                         cooperId: req.params.id
    //                       }
    //                     },
    //                     {
    //                       $lookup: {
    //                         from:
    //                           "cooperativestaffaccounts",
    //                         localField: "cooperativeId",
    //                         foreignField: "cooperativeId",
    //                         as: "cooperative_doc"
    //                       }
    //                     },
    //                     { $unwind: "$cooperative_doc" },

    //                     // {
    //                     //     $lookup: { from: 'cooperativestaffaccount', localField: 'cooperative_doc.cooperativeId', foreignField: 'product', as: 'category_doc' }
    //                     // },
    //                     {
    //                       $match: {
    //                         "cooperative_doc.cooperativeId": cooperate,
    //                          "cooperative_doc.staffId": staff

    //                       }
    //                     },
                      
    //                   ],
    //                   function(err, coocoo) {
    //                     if (err !== null) {
    //                       reject(err);
    //                     } else {
    //                       if (!coocoo) {
    //                         reject(
    //                           new NotFoundError(
    //                             "Cooper Cooperative Staff is not found"
    //                           )
    //                         );
    //                       } else {
    //                         console.log(
    //                           "Reaching top model"
    //                         );
    //                         resolve(coocoo);
    //                       }
    //                     }
    //                   }
    //                 );
    //             });
    //         })
           
    //         .then((saved) => {

    //             // console.log("Got Data After precessing " + JSON.stringify(saved));
    //             callback.onSuccess(saved);
    //         })
    //         .catch((error) => {
    //             callback.onError(error);
    //         });
    // }



    getAllAccountBalances(req, userToken, callback) {

        console.log("Reaching top model up");
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
                if (userToken.cooperId !== req.params.id) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                return new Promise(function (resolve, reject) {
                  
                    CooperCooperativeStaffModel.find({ cooperId: req.params.id}, function (err, coocoo) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!coocoo) {
                                reject(new NotFoundError("Cooper Cooperative Staff is not found"));
                            } else {

                                console.log(coocoo)
                                var CooperativeStaffAccount = [];


                                for (var i = 0, len = coocoo.length; i < len; i++) {
                                    // someFn(coocoo[i]);
                                    CooperativeStaffAccountsModel.find({ cooperativeId: coocoo[i].cooperativeId, staffId: coocoo[i].staffId}, function (err, docs) {
                                        if (docs) {
                                            console.log("Data in DOC " + JSON.stringify(docs));
                                            // resolve(docs);

                                            for (var r = 0, len2 = docs.length; r < len2; r++) {
                                                CooperativeStaffAccount.push(docs[r]);
                                                resolve(CooperativeStaffAccount)
                                            }
                                         
                                        } else {

                                        }
                                    });
                                    // if (i === len) {
                                    //     done()
                                    // }

                                }


   
                            }
                        }
                    })
                });
            }
            })
           
            .then((saved) => {

                // console.log("Got Data After precessing " + JSON.stringify(saved));
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllCooperCooperativeStaffByCooperId(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Cooper Id provided');
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {

                    CooperCooperativeStaffModel.find({ cooperId: req.params.id }, function(err, coocoo) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!coocoo) {
                                reject(new NotFoundError("Cooper Cooperative Staff is not found"));
                            } else {


                                var loopCount = 0;
                                var CooperativeStaffAccount = [];
                                coocoo.forEach(function(element) {
                                    //console.log(element);

                                    CooperativeStaffAccountsModel.find({ cooperativeId: element.cooperativeId, staffId: element.staffId }, function(err, docs) {
                                        if (docs) {
                                            // console.log("Data in DOC " + JSON.stringify(docs));
                                            // resolve(docs);
                                            var innerLoop = 0;
                                            docs.forEach(function(innerelement) {
                                                //console.log(innerelement);
                                                CooperativeStaffAccount.push(innerelement);
                                                console.log("Data in DOC Array " + JSON.stringify(CooperativeStaffAccount));

                                                innerLoop += 1;

                                                if (docs.length === innerLoop) {
                                                    loopCount += 1;
                                                }


                                                if (coocoo.length === loopCount && docs.length === innerLoop) {
                                                    // console.log("Data count is equal");
                                                    console.log("Data count is equal" + JSON.stringify(CooperativeStaffAccount));
                                                    //  var mainData = JSON.stringify(CooperativeStaffAccount);
                                                    resolve(CooperativeStaffAccount);
                                                }

                                            });

                                        } else {

                                        }
                                    });


                                    console.log("Loop " + loopCount + "- List count " + coocoo.length);
                                    //Use the cooper Id and Staff and get account balances and type




                                });



                                // console.log("Cooperative Staff Account Returned " + JSON.stringify(CooperativeStaffAccount));

                                //Iterate Through All the data and resolve into cooperative Staff Account




                                //return CooperativeStaffAccount;
                            }
                        }
                    })
                });
            })
            .then((saved) => {
                //console.log("Comprehensive Result " + saved);
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllCooperCooperativesCooperId(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Cooper Id provided');
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function(resolve, reject) {

                    console.log("Staff in Cooper Cooperative " + req.params.id);
                    CooperCooperativeStaffModel.aggregate([

                        {
                            $match: {cooperId: req.params.id}
                        },
                       

                    ], function(err, coocoo) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!coocoo) {
                                reject(new NotFoundError("Cooper Cooperative Staff is not found"));
                            } else {

                                resolve(coocoo);

                              
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

    getOneCooperCoopByCooperIdAndCooperativeId(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Cooper Id provided');
        req.checkParams('cooperativeId', 'Invalid Cooperative Id provided');
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    CooperCooperativeStaffModel.find({ cooperId: req.params.id, cooperativeId: req.params.cooperativeId }, function(err, coocoo) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!coocoo) {
                                reject(new NotFoundError("Cooper Cooperative Staff is not found"));
                            } else {
                                resolve(coocoo);
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

    getOneCooperCoopByCooperIdAndCooperativeIdAccountType(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Cooper Id provided');
        req.checkParams('cooperativeId', 'Invalid Cooperative Id provided');
        req.checkParams('accountType', 'Invalid Account Type provided');
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    CooperCooperativeStaffModel.find({ cooperId: req.params.id, cooperativeId: req.params.cooperativeId, accounttype: req.params.accountType }, function(err, coocoo) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!coocoo) {
                                reject(new NotFoundError("Cooper Cooperative Staff is not found"));
                            } else {
                                resolve(coocoo);
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


}

module.exports = CooperCooperativeStaffHandler;