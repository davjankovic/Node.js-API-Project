/**
 *  Created by Accelerar on 3/6/2018.
 */
const nodemailer = require("nodemailer");
const TransactionModel = require(APP_MODEL_PATH + 'transaction').TransactionModel;
const CooperativeAPIModel = require(APP_MODEL_PATH + 'cooperativeAPI').CooperativeAPIModel;
const UserModel = require(APP_MODEL_PATH + 'user').UserModel;
const CooperativeStaffAccountsModel = require(APP_MODEL_PATH + 'cooperativeStaffAccounts').CooperativeStaffAccountsModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
var Client = require("node-rest-client").Client;
var client = new Client();
const path = require("path");
const Email = require("email-templates");
class TransactionHandler extends BaseAutoBindedClass {
  constructor() {
    super();
    this._validator = require("validator");
  }

  static get VERIFY_TRANSACTION_SCHEMA() {
    return {
      cooperativeId: {
        notEmpty: true,

        errorMessage: "Invalid Cooperative Id"
      },
      cooperId: {
        notEmpty: true,

        errorMessage: "Invalid Cooper Id"
      },

      vendorId: {
        notEmpty: true,

        errorMessage: "Invalid Vendor Id"
      }
    };
  }

  static get VERIFY_VENDOR_TRANSACTION_SCHEMA() {
    return {
      cooperativeId: {
        notEmpty: true,

        errorMessage: "Invalid Cooperative Id"
      },
      cooperId: {
        notEmpty: true,

        errorMessage: "Invalid Cooper Id"
      },

      vendorId: {
        notEmpty: true,

        errorMessage: "Invalid Vendor Id"
      }
    };
  }

  static get VERIFY_TRANSACTION_ORDER_SCHEMA() {
    return {
      orderStatus: {
        notEmpty: true,

        errorMessage: "Invalid Order Status"
      },
      cooperId: {
        notEmpty: true,

        errorMessage: "Invalid Cooper Id"
      }
    };
  }
  static get VERIFY_VENDOR_TRANSACTION_MAKESALE_SCHEMA() {
    return {
      description: {
        notEmpty: true,

        errorMessage: "Description cannot be emptydescription"
      },
      cooperId: {
        notEmpty: true,

        errorMessage: "Invalid Cooper Id"
      }
    };
  }

  static get TRANSACTION_STATUS_SCHEMA() {
    return {
      status: {
        notEmpty: true,

        errorMessage: "Invalid Status Id"
      },
      cooperId: {
        notEmpty: true,

        errorMessage: "Invalid Cooper Id"
      }
    };
  }

  static get TRANSACTION_VENDOR_STATUS_SCHEMA() {
    return {
      paymentStatus: {
        notEmpty: true,

        errorMessage: "Payment Status"
      },
      vendorId: {
        notEmpty: true,

        errorMessage: "Invalid Vendor Id"
      }
    };
  }

  createTransaction(req, callback) {
    let data = req.body;
    let validator = this._validator;
    req.checkBody(TransactionHandler.VERIFY_TRANSACTION_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }

        return new TransactionModel({
          staffId: data.staffId,
          cooperativeId: validator.trim(data.cooperativeId),
          cooperId: validator.trim(data.cooperId),
          vendorId: validator.trim(data.vendorId),
          product: validator.trim(data.product),
          subVendorId: validator.trim(data.subVendorId),
          paymentStatus: validator.trim(data.paymentStatus),
          transAmount: validator.trim(data.transAmount),
          // amountPaid: validator.trim(data.transAmount),
          // amountOutstanding: validator.trim(data.amountOutstanding),
          // productId: validator.trim(data.productId),
          batchId: Math.floor(Math.random() * 90000000000) + 10000000000,
          productStatus: validator.trim(data.productStatus),
          // paymentType: validator.trim(data.paymentType),
          // paymentTypeSub: validator.trim(data.paymentTypeSub),
          quantity: validator.trim(data.quantity),
          orderStatus: validator.trim(data.orderStatus),
          // uploadInvoiceImage: validator.trim(data.uploadInvoiceImage),
          status: validator.trim(data.status),
          transactionDate: Date.now()
        });
      })
      .then(transaction => {
        transaction.save();
        return transaction;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  createTransactionMakeSale(req, userToken, callback) {
    let data = req.body;
    let dataApi = req.body;
    let validator = this._validator;
    req.checkBody(TransactionHandler.VERIFY_VENDOR_TRANSACTION_MAKESALE_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        if (userToken.cooperId === data.vendorId || userToken.cooperId ===  data.subVendorId) {
        
        return new Promise(function (resolve, reject) {


          console.log('yeah transaction onboard')

          UserModel.findOne({ cooperId: data.cooperId }, function (err, user) {

            if (err !== null) {
              reject(error);


            } else {
              if (!user) {
                reject(new NotFoundError("user not found"));
              } else {



                // console.log('yeah transaction');

                CooperativeAPIModel.findOne({ cooperativeId: data.cooperativeId }, function (err, cooperative) {
                  // console.log('yeah transaction 1' + cooperative);
                  if (err !== null) {
                    reject(err);
                  } else {
                    if (cooperative === null) {
                      reject(new NotFoundError("Cooperative not found"));
                      // console.log('cooperative is null');
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
                          
                          let vendorId = dataApi.vendorId;
                      
                          UserModel.findOne({ cooperId: vendorId }, function (err, vendor) {

                            if (err !== null) {
                              reject(err);


                            } else {
                              if (!vendor) {
                                reject(new NotFoundError("vendor not found"));
                              } else {

                          

                                 let descriptionMessage = ` Transaction from CooperSwitch: Vendor ${vendor.firstName}, ${dataApi.description}  `;
                           console.log(descriptionMessage)
                          console.log(dataApi.description, dataApi.amountPaid)
                          var args = {
                            data: { description: descriptionMessage, email: user.staffId, value: dataApi.amountPaid },
                            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                          };
                          let urlapi = cooperative.apiTransaction.url;

                          client.post("" + urlapi + "", args, function (data, response) {
                            // parsed response body as js object
                            console.log("Data from Cooplag " + JSON.stringify(data));
                            // raw response
                            console.log('Response from Cooplag' + response);

                            if (data.Status === 'Submitted') {

                              resolve( new TransactionModel({
                                cooperativeId: validator.trim(dataApi.cooperativeId),
                                cooperId: validator.trim(dataApi.cooperId),
                                vendorId: validator.trim(dataApi.vendorId),
                                subVendorId: validator.trim(dataApi.subVendorId),
                                batchId: Math.floor(Math.random() * 9000000000) + 1000000000,
                                transAmount: validator.trim(dataApi.amountPaid),
                                productStatus: validator.trim(dataApi.productStatus),
                                description: validator.trim(dataApi.description),
                                orderStatus: "Recent",
                                status: "Success",
                                transactionDate: Date.now()
                              }));
                              console.log(vendor.email)
                      sendEmail("www.cooperswitch.com", vendor.email, vendor.firstName, vendor.lastName, dataApi.amountPaid, dataApi.description, 'Vendor');  
                      sendEmail("www.cooperswitch.com", user.email, user.firstName, vendor.firstName, dataApi.amountPaid, dataApi.description,'Cooperator');  
                             
                            } else {
                              reject(new NotFoundError("Staff not found"));
                            }
                            // raw response
                            // console.log('Response from Cooplag' + response);
                                }).on('error', function (err) {
                                  console.log('something went wrong on the request');
                                });

                                // handling client error events
                                client.on('error', function (err) {
                                  console.error('Something went wrong on the client', err);
                                });

                              }
                            }


                      
                          })

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

              }
            }
          })
        })

      } else {
          throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
    
      }
      })
      .then(transaction => {
        transaction.save();
        return transaction;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  createTransactionMakeSaleRequest(req, callback) {
    let data = req.body;
    let dataApi = req.body;
    let validator = this._validator;
    req.checkBody(TransactionHandler.VERIFY_VENDOR_TRANSACTION_MAKESALE_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }

        return new Promise(function (resolve, reject) {


          console.log('yeah transaction onboard')

          UserModel.findOne({ cooperId: data.cooperId }, function (err, user) {

            if (err !== null) {
              reject(error);


            } else {
              if (!user) {
                reject(new NotFoundError("user not found"));
              } else {



                // console.log('yeah transaction');

                CooperativeAPIModel.findOne({ cooperativeId: data.cooperativeId }, function (err, cooperative) {
                  // console.log('yeah transaction 1' + cooperative);
                  if (err !== null) {
                    reject(err);
                  } else {
                    if (cooperative === null) {
                      reject(new NotFoundError("Cooperative not found"));
                      // console.log('cooperative is null');
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
                          

                          UserModel.findOne({ cooperId: dataApi.vendorId }, function (err, vendor) {

                            if (err !== null) {
                              reject(error);


                            } else {
                              if (!vendor) {
                                reject(new NotFoundError("vendor not found"));
                              } else {

                          

                                // let descriptionMessage = ` Transaction from CooperSwitch: Vendor ${vendor.firstName} ${vendor.lastName},  `;
                          // console.log(descriptionMessage)
                          var args = {
                            data: { description: dataApi.description, email: user.staffId, value: dataApi.amountPaid },
                            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                          };
                          let urlapi = cooperative.apiTransaction.url;

                          client.post("" + urlapi + "", args, function (data, response) {
                            // parsed response body as js object
                            console.log("Data from Cooplag " + JSON.stringify(data));
                            // raw response
                            console.log('Response from Cooplag' + response);

                            if (data.Status === 'Submitted') {

                              resolve( new TransactionModel({
                                cooperativeId: validator.trim(dataApi.cooperativeId),
                                cooperId: validator.trim(dataApi.cooperId),
                                vendorId: validator.trim(dataApi.vendorId),
                                subVendorId: validator.trim(dataApi.subVendorId),
                                batchId: Math.floor(Math.random() * 9000000000) + 1000000000,
                                transAmount: validator.trim(dataApi.amountPaid),
                                productStatus: validator.trim(dataApi.productStatus),
                                description: validator.trim(dataApi.description),
                                orderStatus: "Recent",
                                status: "Pending",
                                transactionDate: Date.now()
                              }));
                              console.log(vendor.email)
                      sendEmail("www.cooperswitch.com", vendor.email, vendor.firstName, dataApi.description, 'Vendor');  
                      sendEmail("www.cooperswitch.com", user.email, user.firstName, dataApi.description,'Cooperator');  
                             
                            } else {
                              reject(new NotFoundError("Staff not found"));
                            }
                            // raw response
                            // console.log('Response from Cooplag' + response);
                                }).on('error', function (err) {
                                  console.log('something went wrong on the request');
                                });

                                // handling client error events
                                client.on('error', function (err) {
                                  console.error('Something went wrong on the client', err);
                                });

                              }
                            }


                      
                          })

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

              }
            }
          })
        })

       
      })
      .then(transaction => {
        transaction.save();
        return transaction;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  deletetransaction(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Transaction Id").isMongoId();
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.findOne({ _id: req.params.id }, function(
            err,
            transaction
          ) {
            if (err !== null) {
              reject(err);
            } else {
              if (!transaction) {
                reject(new NotFoundError("Token not found"));
              } else {
                resolve(transaction);
              }
            }
          });
        });
      })
      .then(transaction => {
        transaction.remove();
        return transaction;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  updateTransactionMakeSale(req, callback) {
    let data = req.body;
    let dataApi = req.body;
    let validator = this._validator;
    req.checkBody(TransactionHandler.VERIFY_VENDOR_TRANSACTION_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function (resolve, reject) {
          TransactionModel.findOne({ _id: req.params.id }, function (
            err,
            transaction
          ) {
            if (err !== null) {
              reject(err);
            } else {
              if (!transaction) {
                reject(new NotFoundError("Token not found"));
              } else {
          
         
            

                  // transaction.save();
                  // callback.onSuccess(transaction);
                resolve(transaction);
              }
            }
          });
        });
      })
      // .then(transaction => {
      //   (transaction.cooperativeId = validator.trim(data.cooperativeId)),
      //     (transaction.cooperId = validator.trim(data.cooperId)),
      //     (transaction.vendorId = validator.trim(data.vendorId)),
      //     (transaction.subVendorId = validator.trim(data.subVendorId)),
      //     (transaction.transAmount = validator.trim(data.amountPaid)),
      //     (transaction.status = "Success"),
      //     (transaction.dateModified = new Date());
      //   transaction.save();
      //   return transaction;
      // })
      // .then(transaction => {
      //   return new Promise(function(resolve, reject) {
      //     CooperativeStaffAccountsModel.findOne(
      //       {
      //         cooperativeId: data.cooperativeId,
      //         staffId: data.staffId,
      //         accountType: data.accountType
      //       },
      //       function(err, docs) {
      //         if (docs) {
      //           resolve(docs);
      //         } else {
      //           reject(new AlreadyExistsError("Account not found"));
      //         }
      //       }
      //     );
      //     return transaction;
      //   });
      // })
      .then(transaction => {
        console.log(validator.trim(data.amountPaid));
        // transaction.accountBalance -= data.amountPaid;
        return new Promise(function(resolve, reject) {


          console.log('yeah transaction onboard')

          UserModel.findOne({ cooperId: data.cooperId }, function (err, user) {

            if (err !== null) {
              reject(error);


            } else {
              if (!user) {
                reject(new NotFoundError("user not found"));
              } else {



                console.log('yeah transaction');

                CooperativeAPIModel.findOne({ cooperativeId: data.cooperativeId }, function (err, cooperative) {
                  console.log('yeah transaction 1' + cooperative);
                  if (err !== null) {
                    reject(err);
                  } else {
                    if (cooperative === null) {
                      reject(new NotFoundError("Cooperative not found"));
                      console.log('cooperative is null');
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
                          // var args = {

                          //   headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                          // };

                          // let validUrl = cooperative.validateMember.url;

                          // client.get("" + validUrl + "" + dataAPI.id, args, function (data, response) {
                          //   // parsed response body as js object
                          //   console.log("Member Data from Cooplag " + JSON.stringify(data));
                          var args = {
                            data: { description: 'trans from cooperswitch', email: user.staffId, value: dataApi.amountPaid },
                            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                          };
                          let urlapi = cooperative.apiTransaction.url;

                          client.post("" + urlapi + "", args, function (data, response) {
                            // parsed response body as js object
                            console.log("Data from Cooplag " + JSON.stringify(data));
                            // raw response
                            console.log('Response from Cooplag' + response);

                            if (data.Status === 'Submitted') {

                              (transaction.cooperativeId = validator.trim(dataApi.cooperativeId)),
                                (transaction.cooperId = validator.trim(dataApi.cooperId)),
                                (transaction.vendorId = validator.trim(dataApi.vendorId)),
                                (transaction.subVendorId = validator.trim(dataApi.subVendorId)),
                                (transaction.transAmount = validator.trim(dataApi.amountPaid)),
                                (transaction.status = "Success"),
                                (transaction.dateModified = new Date());
                              transaction.save();
                              resolve(transaction);

                            } else {
                              reject(new NotFoundError("Staff not found"));
                            }
                            // raw response
                            // console.log('Response from Cooplag' + response);
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

              }
            }
          })
        })
       

      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  updatetransaction(req, callback) {
    let data = req.body;
    let validator = this._validator;
    req.checkBody(TransactionHandler.VERIFY_TRANSACTION_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.findOne({ _id: req.params.id }, function(
            err,
            transaction
          ) {
            if (err !== null) {
              reject(err);
            } else {
              if (!transaction) {
                reject(new NotFoundError("Token not found"));
              } else {
                resolve(transaction);
              }
            }
          });
        });
      })
      .then(transaction => {
        (transaction.staffId = validator.trim(data.staffId)),
          (transaction.cooperativeId = validator.trim(data.cooperativeId)),
          (transaction.cooperId = validator.trim(data.cooperId)),
          (transaction.vendorId = validator.trim(data.vendorId)),
          (transaction.productId = validator.trim(data.productId)),
          (transaction.subVendorId = validator.trim(data.subVendorId)),
          (transaction.transactRefNo = validator.trim(data.transactRefNo)),
          (transaction.cooperativeTranId = validator.trim(
            data.cooperativeTranId
          )),
          (transaction.authorizerPersonId = validator.trim(
            data.authorizerPersonId
          )),
          (transaction.authorizationStatus = validator.trim(
            data.authorizationStatus
          )),
          (transaction.transactStatus = validator.trim(data.transactStatus)),
          (transaction.paymentStatus = validator.trim(data.paymentStatus)),
          (transaction.transAmout = validator.trim(data.transAmout)),
          (transaction.amountPaid = validator.trim(data.amountPaid)),
          (transaction.amountOutstanding = validator.trim(
            data.amountOutstanding
          )),
          (transaction.productId = validator.trim(data.productId)),
          (transaction.batchId = validator.trim(data.batchId)),
          (transaction.productStatus = validator.trim(data.productStatus)),
          (transaction.paymentType = validator.trim(data.paymentType)),
          (transaction.paymentTypeSub = validator.trim(data.paymentTypeSub)),
          (transaction.quantity = validator.trim(data.quantity)),
          (transaction.orderStatus = validator.trim(data.orderStatus)),
          (transaction.uploadInvoiceImage = validator.trim(
            data.uploadInvoiceImage
          )),
          (transaction.status = validator.trim(data.status)),
          (transaction.transactionDate = validator.trim(data.transactionDate));

        transaction.dateModified = new Date();
        transaction.save();
        return transaction;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  updatetransactionStatus(req, callback) {
    let data = req.body;
    let validator = this._validator;
    req.checkBody(TransactionHandler.TRANSACTION_STATUS_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.findOne({ _id: req.params.id }, function(
            err,
            transaction
          ) {
            if (err !== null) {
              reject(err);
            } else {
              if (!transaction) {
                reject(new NotFoundError("Transaction does not exit"));
              } else {
                resolve(transaction);
              }
            }
          });
        });
      })
      .then(transaction => {
        transaction.status = validator.trim(data.status);

        transaction.save();

        TransactionModel.find({ cooperId: data.cooperId }, function(
          err,
          transaction
        ) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        });

        // return transaction;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getTransactionPaymentStatus(req, callback) {
    let data = req.body;
    let validator = this._validator;
    req.checkBody(TransactionHandler.TRANSACTION_VENDOR_STATUS_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.find(
            { vendorId: data.vendorId, paymentStatus: data.paymentStatus },
            function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Transaction does not exit"));
                } else {
                  resolve(transaction);
                }
              }
            }
          );
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllTransactionStatusByRecent(req, callback) {
    let data = req.body;
    let validator = this._validator;
    req.checkBody(TransactionHandler.VERIFY_TRANSACTION_ORDER_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.find(
            { cooperId: data.cooperId, orderStatus: data.orderStatus },
            function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Transaction does not exit"));
                } else {
                  resolve(transaction);
                }
              }
            }
          );
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getSingletransaction(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Token provided").isMongoId();
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.findOne({ _id: req.params.id }, function(
            err,
            transaction
          ) {
            if (err !== null) {
              reject(err);
            } else {
              if (!transaction) {
                reject(new NotFoundError("Token not found"));
              } else {
                resolve(transaction);
              }
            }
          });
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getTransactionByProductId(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Token provided").isMongoId();
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.where({ product: req.params.id })
            .count(function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Token not found"));
                } else {
                  resolve(transaction);
                }
              }
            })
            .count();
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getQuantitySoldByProduct(req, callback) {
    let data = req.body;
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          let vendorId = req.params.id;
          TransactionModel.aggregate([
            {
              $match: {vendorId: vendorId}
            },

            {
              $group: { _id: '$product', quantitySold: { $sum: 1 } }
            },

            {
              $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product_doc"
              }
            },
            { $unwind: "$product_doc" },

           

           
         
          ], function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Token not found"));
                } else {
                  resolve(transaction);
                }
              }
            })
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllTransactionByVendorId(req, userToken, callback) {
    let data = req.body;
   
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        if (userToken.cooperId !== req.params.id) {
          throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
        } else {
        return new Promise(function(resolve, reject) {
          let vendorId = req.params.id;
          TransactionModel.aggregate([
            {
              $match: { $or: [{ vendorId: vendorId }, { subVendorId: vendorId }] }
            },

            { $sort: { _id: -1 } }

          ], function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Token not found"));
                } else {
                  resolve(transaction);
                }
              }
            })
        });
      }
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
    
  }

  getVendorPaymentHistoryWeek(req, callback) {
    let data = req.body;
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          var d = new Date();
          d.setDate(d.getDate() - 7);

          let vendorId = req.params.id;
          TransactionModel.aggregate([
            {
              $match: {vendorId: vendorId, transactionDate: {$gt: d}}
            },


          ], function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Token not found"));
                } else {
                  resolve(transaction);
                }
              }
            })
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }
  getVendorPaymentHistoryMonth(req, callback) {
    let data = req.body;
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          var d = new Date();
          d.setDate(d.getDate() - 30);

          let vendorId = req.params.id;
          TransactionModel.aggregate([
            {
              $match: {vendorId: vendorId, transactionDate: {$gt: d}}
            },


          ], function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Token not found"));
                } else {
                  resolve(transaction);
                }
              }
            })
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }
  getVendorPaymentHistoryYear(req, callback) {
    let data = req.body;
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          var d = new Date();
          d.setDate(d.getDate() - 365);

          let vendorId = req.params.id;
          TransactionModel.aggregate([
            {
              $match: {vendorId: vendorId, transactionDate: {$gt: d}}
            },


          ], function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Token not found"));
                } else {
                  resolve(transaction);
                }
              }
            })
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAlltransaction(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      TransactionModel.find({}, function(err, transaction) {
        if (err !== null) {
          reject(err);
        } else {
          resolve(transaction);
        }
      });
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllTransByCooperativeId(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          },

          {
            $group: { _id: null, totalAmount: { $sum: "$transAmount" } }
          }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllCooperativeTransaction(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          }

          // {
          //   $group: { _id: null, totalAmount: { $sum: "$transAmount" } }
          // }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getOutstandingTrans(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId, status: "Pending" }
          }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getSpendingPattern(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId, status: "Success" }
          },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "product_doc"
            }
          },
          { $unwind: "$product_doc" },

          {
            $lookup: {
              from: "productcategories",
              localField: "product_doc._id",
              foreignField: "product",
              as: "category_doc"
            }
          },

          { $unwind: "$category_doc" },
          {
            $lookup: {
              from: "categories",
              localField: "category_doc.category",
              foreignField: "_id",
              as: "cate_doc"
            }
          },
          { $unwind: "$cate_doc" },

          { $group: { _id: "$cate_doc.categoryName", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  getCustomerSpendingPattern(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: { status: "Success" }
          },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "product_doc"
            }
          },
          { $unwind: "$product_doc" },

          {
            $lookup: {
              from: "productcategories",
              localField: "product_doc._id",
              foreignField: "product",
              as: "category_doc"
            }
          },

          { $unwind: "$category_doc" },
          {
            $lookup: {
              from: "categories",
              localField: "category_doc.category",
              foreignField: "_id",
              as: "cate_doc"
            }
          },
          { $unwind: "$cate_doc" },

          { $group: { _id: "$cate_doc.categoryName", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getCooperatorSpendingPattern(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: { cooperId: cooperId, status: "Success" }
          },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "product_doc"
            }
          },
          { $unwind: "$product_doc" },

          {
            $lookup: {
              from: "productcategories",
              localField: "product_doc._id",
              foreignField: "product",
              as: "category_doc"
            }
          },

          { $unwind: "$category_doc" },
          {
            $lookup: {
              from: "categories",
              localField: "category_doc.category",
              foreignField: "_id",
              as: "cate_doc"
            }
          },
          { $unwind: "$cate_doc" },

          { $group: { _id: "$cate_doc.categoryName", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getVendorPerformance(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId, status: "Success" }
          },
          { $group: { _id: "$vendorId", count: { $sum: 1 } } },

          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "cooperId",
              as: "user_doc"
            }
          },
          { $unwind: "$user_doc" },

          { $project: { firstName: "$user_doc.firstName", count: 1, _id: 0 } },

          { $sort: { count: -1 } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllVendorByWeek(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          },
        

          {
            "$project": {
              "transactionDateWeek": { "$week": "$transactionDate" },
              "transactionDateMonth": { "$month": "$transactionDate" },
              "transactionDateYear": { "$year": "$transactionDate" },
              // "rating": 1
            }
          },
          {
            "$group": {
              "_id": "$transactionDateWeek",
              // "average": { "$avg": "$rating" },
              "week": { "$first": "$transactionDateWeek" },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
      
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  showAllWeeklyTransactions(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
         
          {
            "$project": {
              "transactionDateWeek": { "$week": "$transactionDate" },
              "transactionDateMonth": { "$month": "$transactionDate" },
              "transactionDateYear": { "$year": "$transactionDate" },
              // "rating": 1
            }
          },
          {
            "$group": {
              "_id": "$transactionDateWeek",
              // "average": { "$avg": "$rating" },
              "week": { "$first": "$transactionDateWeek" },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
      
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllVendorByMonth(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          },
         

  
          {
            "$project": {
              "transactionDateWeek": { "$week": "$transactionDate" },
              "transactionDateMonth": { "$month": "$transactionDate" },
              "transactionDateYear": { "$year": "$transactionDate" },
              // "rating": 1
            }
          },
          {
            "$group": {
              "_id": "$transactionDateMonth",
              // "average": { "$avg": "$rating" },
              "month": { "$first": "$transactionDateMonth" },
              count: { $sum: 1 }
              
            }
          },

          { $sort: { _id: -1 } },

      
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  showMontlyTransactions(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
         
  
          {
            "$project": {
              "transactionDateWeek": { "$week": "$transactionDate" },
              "transactionDateMonth": { "$month": "$transactionDate" },
              "transactionDateYear": { "$year": "$transactionDate" },
              // "rating": 1
            }
          },
          {
            "$group": {
              "_id": "$transactionDateMonth",
              // "average": { "$avg": "$rating" },
              "month": { "$first": "$transactionDateMonth" },
              count: { $sum: 1 }
              
            }
          },

          { $sort: { _id: -1 } },

      
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllVendorByYear(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          },

          {
            $project: {
              transactionDateWeek: { $week: "$transactionDate" },
              transactionDateMonth: { $month: "$transactionDate" },
              transactionDateYear: { $year: "$transactionDate" }
              // "rating": 1
            }
          },
          {
            $group: {
              _id: "$transactionDateYear",
              // "average": { "$avg": "$rating" },
              week: { $first: "$transactionDateYear" },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  showYearlyTransactions(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
         
          {
            $project: {
              transactionDateWeek: { $week: "$transactionDate" },
              transactionDateMonth: { $month: "$transactionDate" },
              transactionDateYear: { $year: "$transactionDate" }
              // "rating": 1
            }
          },
          {
            $group: {
              _id: "$transactionDateYear",
              // "average": { "$avg": "$rating" },
              year: { $first: "$transactionDateYear" },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  getAllYearlyPurchase(req, callback) {
    let data = req.body;
    new Promise(function (resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          },

          {
            $project: {
              transactionDateWeek: { $week: "$transactionDate" },
              transactionDateMonth: { $month: "$transactionDate" },
              transactionDateYear: { $year: "$transactionDate" },
              total: { $sum: "$transAmount" }
            }
          },
          {
            $group: {
              _id: "$transactionDateYear",
              // "average": { "$avg": "$rating" },
              year: { $first: "$transactionDateYear" },
              total: { $sum: "$total" }
            }
          },
          { $sort: { _id: 1 } },
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  sumYearlyPurchases(req, callback) {
    let data = req.body;
    new Promise(function (resolve, reject) {
     
      TransactionModel.aggregate(
        [
         
          {
            $project: {
              transactionDateWeek: { $week: "$transactionDate" },
              transactionDateMonth: { $month: "$transactionDate" },
              transactionDateYear: { $year: "$transactionDate" },
              total: { $sum: "$transAmount" }
            }
          },
          {
            $group: {
              _id: "$transactionDateYear",
              // "average": { "$avg": "$rating" },
              year: { $first: "$transactionDateYear" },
              total: { $sum: "$total" }
            }
          },
          { $sort: { _id: 1 } },
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllMonthlyPurchase(req, callback) {
    let data = req.body;
    new Promise(function (resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          },

          {
            $project: {
              transactionDateWeek: { $week: "$transactionDate" },
              transactionDateMonth: { $month: "$transactionDate" },
              transactionDateYear: { $year: "$transactionDate" },
              total: { $sum: "$transAmount" }
            }
          },
          {
            $group: {
              _id: "$transactionDateMonth",
              // "average": { "$avg": "$rating" },
              month: { $first: "$transactionDateMonth" },
              total: { $sum: "$total" }
            }
          },
          { $sort: { _id: 1 } },
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  sumMonthlyPurchases(req, callback) {
    let data = req.body;
    new Promise(function (resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $project: {
              transactionDateWeek: { $week: "$transactionDate" },
              transactionDateMonth: { $month: "$transactionDate" },
              transactionDateYear: { $year: "$transactionDate" },
              total: { $sum: "$transAmount" }
            }
          },
          {
            $group: {
              _id: "$transactionDateMonth",
              // "average": { "$avg": "$rating" },
              month: { $first: "$transactionDateMonth" },
              total: { $sum: "$total" }
            }
          },
          { $sort: { _id: 1 } },
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  getAllWeeklyPurchase(req, callback) {
    let data = req.body;
    new Promise(function (resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          },

          {
            $project: {
              transactionDateWeek: { $week: "$transactionDate" },
              transactionDateMonth: { $month: "$transactionDate" },
              transactionDateYear: { $year: "$transactionDate" },
              total: { $sum: "$transAmount" }
            }
          },
          {
            $group: {
              _id: "$transactionDateWeek",
              // "average": { "$avg": "$rating" },
              week: { $first: "$transactionDateWeek" },
              total: { $sum: "$total" }
            }
          },
          { $sort: { _id: 1 } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  sumWeeklyPurchases(req, callback) {
    let data = req.body;
    new Promise(function (resolve, reject) {
      let cooperatId = req.params.id;

      TransactionModel.aggregate(
        [
          {
            $project: {
              transactionDateWeek: { $week: "$transactionDate" },
              transactionDateMonth: { $month: "$transactionDate" },
              transactionDateYear: { $year: "$transactionDate" },
              total: { $sum: "$transAmount" }
            }
          },
          {
            $group: {
              _id: "$transactionDateWeek",
              // "average": { "$avg": "$rating" },
              week: { $first: "$transactionDateWeek" },
              total: { $sum: "$total" }
            }
          },
          { $sort: { _id: 1 } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getSingleVendorPerformance(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      let vendorId = req.params.vendorId;
      TransactionModel.aggregate(
        [
          {
            $match: {
              cooperativeId: cooperatId,
              status: "Success",
              vendorId: vendorId
            }
          },
          // { $group: { _id: { vendorId: "$vendorId" }, number: { "$sum": 1 }, data: { $push: "$$ROOT" } } },
          {
            $lookup: {
              from: "users",
              localField: "vendorId",
              foreignField: "cooperId",
              as: "user_doc"
            }
          },

          {
            $unwind: '$user_doc'
          },

          {
            $group: {
              _id: { user_doc: "$user_doc.firstName" },
              number: { $sum: 1 },
              data: { $push: "$$ROOT" }
            }
          },
          { $project: { "_id.user_doc": 1, number: 1 } },
          { $sort: { number: -1 } }
          // { $match: { user_doc: { $ne: [] } } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAdminVendorPerformance(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
    
      let vendorId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: {
              status: "Success",
              vendorId: vendorId
            }
          },
          // { $group: { _id: { vendorId: "$vendorId" }, number: { "$sum": 1 }, data: { $push: "$$ROOT" } } },
          {
            $lookup: {
              from: "users",
              localField: "vendorId",
              foreignField: "cooperId",
              as: "user_doc"
            }
          },

          {
            $unwind: '$user_doc'
          },

          {
            $group: {
              _id: { user_doc: "$user_doc.firstName" },
              number: { $sum: 1 },
              data: { $push: "$$ROOT" }
            }
          },
          { $project: { "_id.user_doc": 1, number: 1 } },
          { $sort: { number: -1 } }
          // { $match: { user_doc: { $ne: [] } } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getSingleVendorInfo(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      let vendorId = req.params.vendorId;
      TransactionModel.aggregate(
        [
          {
            $match: {
              cooperativeId: cooperatId,
              status: "Success",
              vendorId: vendorId
            }
          },
          // { $group: { _id: { vendorId: "$vendorId" }, number: { "$sum": 1 }, data: { $push: "$$ROOT" } } },
          {
            $lookup: {
              from: "users",
              localField: "vendorId",
              foreignField: "cooperId",
              as: "user_doc"
            }
          },

          // {
          //   $group: {
          //     _id: { user_doc: "$user_doc.firstName" },
          //     number: { $sum: 1 },
          //     data: { $push: "$$ROOT" }
          //   }
          // },
          // { $project: { "_id.user_doc": 1, number: 1 } },
          { $sort: { transactionDate: -1 } }
          // { $match: { user_doc: { $ne: [] } } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getRecentCooperatorTrans(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      let cooperId = req.params.cooperId;
      TransactionModel.aggregate(
        [
          {
            $match: {
              cooperativeId: cooperatId,
              status: "Success",
              cooperId: cooperId
            }
          },
          // { $group: { _id: { vendorId: "$vendorId" }, number: { "$sum": 1 }, data: { $push: "$$ROOT" } } },
          {
            $lookup: {
              from: "users",
              localField: "cooperId",
              foreignField: "cooperId",
              as: "user_doc"
            }
          },

          // {
          //   $group: {
          //     _id: { user_doc: "$user_doc.firstName" },
          //     number: { $sum: 1 },
          //     data: { $push: "$$ROOT" }
          //   }
          // },
          // { $project: { "_id.user_doc": 1, number: 1 } },
          { $sort: { transactionDate: -1 } }
          // { $match: { user_doc: { $ne: [] } } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getRecentCooperatorTransAdmin(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: {
              status: "Success",
              cooperId: cooperId
            }
          },
          // { $group: { _id: { vendorId: "$vendorId" }, number: { "$sum": 1 }, data: { $push: "$$ROOT" } } },
          {
            $lookup: {
              from: "users",
              localField: "cooperId",
              foreignField: "cooperId",
              as: "user_doc"
            }
          },

          // {
          //   $group: {
          //     _id: { user_doc: "$user_doc.firstName" },
          //     number: { $sum: 1 },
          //     data: { $push: "$$ROOT" }
          //   }
          // },
          // { $project: { "_id.user_doc": 1, number: 1 } },
          { $sort: { transactionDate: -1 } }
          // { $match: { user_doc: { $ne: [] } } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getRecentVendorTransAdmin(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let vendorId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: {
              status: "Success",
              vendorId: vendorId
            }
          },
          // { $group: { _id: { vendorId: "$vendorId" }, number: { "$sum": 1 }, data: { $push: "$$ROOT" } } },
          {
            $lookup: {
              from: "users",
              localField: "vendorId",
              foreignField: "cooperId",
              as: "user_doc"
            }
          },

          // {
          //   $group: {
          //     _id: { user_doc: "$user_doc.firstName" },
          //     number: { $sum: 1 },
          //     data: { $push: "$$ROOT" }
          //   }
          // },
          // { $project: { "_id.user_doc": 1, number: 1 } },
          { $sort: { transactionDate: -1 } }
          // { $match: { user_doc: { $ne: [] } } }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getQuantitySoldByCooperativeId(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      let cooperatId = req.params.id;
      TransactionModel.aggregate(
        [
          {
            $match: { cooperativeId: cooperatId }
          },

          {
            $group: { _id: null, totalQuantity: { $sum: "$quantity" } }
          }
        ],
        function(err, transaction) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(transaction);
          }
        }
      );
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  getTransactionsByCooperId(req, userToken, callback) {
    let data = req.body;

    req
      .getValidationResult()
      .then(function (result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function (elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        if (userToken.cooperId !== req.params.id) {
          throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
        } else {
          return new Promise(function (resolve, reject) {
     
            TransactionModel.aggregate([
              {
                $match: { cooperId: req.params.id }
              },

              {
                $lookup: {
                  from: "users",
                  localField: "vendorId",
                  foreignField: "cooperId",
                  as: "user"
                }
              },
              { $unwind: "$user" },
              {
                $lookup: {
                  from: "products",
                  localField: "product",
                  foreignField: "_id",
                  as: "product"
                }
              },
           {$unwind: {
           path :'$product', 
           preserveNullAndEmptyArrays: true}
           },
              {
                $project: { batchId: 1,
                          'user.cooperId': 1,
                          'user.firstName': 1,
                          'user.lastName': 1,
                          transAmount: 1,
                          transactionDate: 1,
                          'product.productName': 1

              }
              },
              { $sort: { _id: -1 } }

            ], function (err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Token not found"));
                } else {
                  resolve(transaction);
                }
              }
            })
          });
        }
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });

  }


  getTotalOrdersCountWeek(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Cooper ID provided");
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {

          var d = new Date();
          d.setDate(d.getDate() - 7);

          TransactionModel.aggregate(
            [
              {
                $match: { vendorId: req.params.id, transactionDate: { $gt: d } }
              },
              {
                $group: {_id:'_id', totalOrder: {$sum: 1}}
              },

              {
                $project: {_id: 0}
              }
              
            ],
            function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Transactions not found"));
                } else {
                  resolve(transaction);
                }
              }
            }
          );
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  getTotalOrdersCount(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Cooper ID provided");
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.aggregate(
            [
              {
                $match: { cooperId: req.params.id }
              },
              {
                $group: {_id:'transAmount', totalOrder: {$sum: '$transAmount'}}
              },
              
            ],
            function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Transactions not found"));
                } else {
                  resolve(transaction);
                }
              }
            }
          );
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }
  getTotalOrdersCountByVendor(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Cooper ID provided");
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.aggregate(
            [
              {
                $match: { vendorId: req.params.id }
              },
              {
                $group: {_id:'transAmount', totalOrder: {$sum: '$transAmount'}}
              },
              {
                $project: {_id: 0}
              }
              
            ],
            function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Transactions not found"));
                } else {
                  resolve(transaction);
                }
              }
            }
          );
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getTotalCustomers(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Cooper ID provided");
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.aggregate(
            [
              {
                $match: { vendorId: req.params.id, cooperId: req.params.cooperId }
              },
              {
                $group: {_id:'_id', totalCustomers: {$sum: 1}}
              },
              {
                $project: {_id: 0}
              }
              
            ],
            function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Transactions not found"));
                } else {
                  resolve(transaction);
                }
              }
            }
          );
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }


  getAllTransactionAmount(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Cooper ID provided");
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          TransactionModel.aggregate(
            [
             
              {
                $group: {_id:'transAmount', totalOrder: {$sum: '$transAmount'}}
              },
              
            ],
            function(err, transaction) {
              if (err !== null) {
                reject(err);
              } else {
                if (!transaction) {
                  reject(new NotFoundError("Transactions not found"));
                } else {
                  resolve(transaction);
                }
              }
            }
          );
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }
}


// function sendEmail(emailLinks, emailaddress, firstName, transAmount, userMode) {

//   //nodemailer.createTestAccount((err, account) => {
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     name: 'mail.cooperswitch.com',
//     host: 'mail.cooperswitch.com',
//     port: 26,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'info@cooperswitch.com', // generated ethereal user
//       pass: 'Accelerar@@1234' // generated ethereal password
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });

//   if(userMode === 'Vendor'){

//     // setup email data with unicode symbols
//     let mailOptions = {
//       from: '"Cooper Switch" <info@cooperswitch.com>', to: `${emailaddress // sender address
//         }`, subject: "Transaction Details",  // list of receivers // Subject line
//       html: `


//             Hi ${firstName}, <br/>
//             <p><h2> Your product(s) were just sold <h2><p>
//             <p>One or more of your products were just sold on CooperSwitch to the tune of N ${transAmount}</p>
      
//            <p>Thanks,</p><br/>
//            <p>Team CooperSwitch</p>'` }; // html body

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return console.log(error);
//       }
//       console.log(info)
//       console.log('Message sent: %s', info.messageId);
//       // Preview only available when sending through an Ethereal account
//       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//       // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
//   // });


//   } else if(userMode === 'Cooperator') {
//     // setup email data with unicode symbols
//     let mailOptions = {
//       from: '"Cooper Switch" <info@cooperswitch.com>', to: `${emailaddress // sender address
//         }`, subject: "Payment Notification",  // list of receivers // Subject line
//       html: `


//             Hi ${firstName}, <br/>
//             <p><h2> Your payment was successful <h2><p>
//             <p> You have successfully paid for product worth ${transAmount}. <p>
//             <p>Thank you for making a purchase with CooperSwitch.</p>
//            <p>Team CooperSwitch</p>'` }; // html body

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return console.log(error);
//       }
    
//       console.log('Message sent: %s', info.messageId);
//       // Preview only available when sending through an Ethereal account
//       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//       // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
//   // });

//   }

// }

function sendEmail(emailLinks, emailaddress, firstName, vendor, amountPaid, description, userMode) {

  var templateDir = path.join(__dirname, '../../', 'templates', 'makeSaleTem')

  const email = new Email({
    views: { root: templateDir },

    send: true,
    transport: {
      name: process.env.MAIL_NAME,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
        pass: process.env.MAIL_PASSWORD // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    },


  });


  if (userMode === "Vendor" && typeof vendor !== undefined) {

    //create the path of email template folder 


    email.send({
      template: path.join(__dirname, '../../', 'templates', 'makeSaleMail'),
      message: {
        to: emailaddress,
        from: '"Cooper Switch" <info@cooperswitch.com>',
      },

      locals: {
        emailaddress: emailaddress,
        description: description,
        amountPaid: amountPaid,
        firstName: firstName
      }
    })
      .then(console.log)
      .catch(console.error);


  } else if (userMode === "Cooperator" && typeof vendor !== undefined ) {






    email.send({
      template: path.join(__dirname, '../../', 'templates', 'copMakeSaleTem'),
      message: {
        to: emailaddress,
        from: '"Cooper Switch" <info@cooperswitch.com>',
      },

      locals: {
        emailaddress: emailaddress,
        description: description,
        amountPaid: amountPaid,
        firstName: firstName,
        vendor: vendor
      }
    })
      .then((console.log))
      .catch(console.error);
    // setup email data with unicode symbols


  }
}




module.exports = TransactionHandler;