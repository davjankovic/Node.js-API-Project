/**
 *  Created by Accelerar on 3/6/2018.
 */
const nodemailer = require('nodemailer');
const CategoryModel = require(APP_MODEL_PATH + 'category').CategoryModel;
const MailConfigModel = require(APP_MODEL_PATH + 'mailConfig').MailConfigModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
const multer = require('multer');
const validator = require('validator');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58


class CategoryHandler extends BaseAutoBindedClass {
    constructor() {
        super();
       
    }

    static get VERIFY_CATEGORY_SCHEMA() {
        return {
            'categoryName': {
                notEmpty: true,

                errorMessage: 'Category cannot be empty'
            },

        };
    }

    createCategory(req, callback, res) {
        const MIME_TYPE_MAP = {
            "image/png": "png",
            "image/jpg": "jpg",
            "image/jpeg": "jpg"
        };

        const Storage = multer.diskStorage({
            destination: (req, file, callback) => {
                const isValid = MIME_TYPE_MAP[file.mimetype];
                let error = new Error("Invalid mime type");
                if (isValid) {
                    error = null;
                }
                callback(error, "public/category");
            },
            filename: function (req, file, callback) {
                const name = file.originalname
                    .toLowerCase()
                    .split(" ")
                    .join("-");
                const ext = MIME_TYPE_MAP[file.mimetype];
                callback(null, name + "-" + Date.now() + "." + ext);
            }
        });


        // var filenameConcat = "";

        var upload = multer({ storage: Storage }).single("imagePath"); //Field name and max count
        // var _that = this;
        upload(req, res, function (err) {
            if (err) {
                //return res.end("Something went wrong!");

                console.log("Reaching Upload error " + err);
            }

        let data = req.body;
      
        req.checkBody(CategoryHandler.VERIFY_CATEGORY_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                return new Promise(function(resolve, reject) {
                    CategoryModel.findOne({ categoryName: data.categoryName }, function(err, cat) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cat) {
                                const url = req.protocol + '://' + req.get('host');
                                resolve(new CategoryModel({

                                    categoryName: validator.trim(data.categoryName),
                                    status: "Active",
                                    imagePath: url + '/category/' + req.file.filename,

                                }));

                            } else {
                                reject(new NotFoundError("Category Exist"));
                            }
                        }
                    })
                });




            })
            .then((cat) => {
                cat.save();
                return cat;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });

        });
    }

    deleteCategory(req, callback) {
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
                    CategoryModel.findOne({ _id: req.params.id }, function(err, cat) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cat) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(cat);
                            }
                        }
                    })
                });
            })
            .then((cat) => {
                cat.remove();
                return cat;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateCategory(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(CategoryHandler.VERIFY_CATEGORY_SCHEMA);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    CategoryModel.findOne({ _id: req.params.id }, function(err, cat) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cat) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(cat);
                            }
                        }
                    })
                });
            })
            .then((cat) => {
                cat.categoryName = validator.trim(data.categoryName);
                cat.imagePath = validator.trim(data.imagePath);
                cat.dateModified = new Date();

                cat.save();
                return cat;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleCategory(req, callback) {
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
                    CategoryModel.findOne({ _id: req.params.id }, function(err, cat) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!cat) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(cat);
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

    getAllCategory(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                CategoryModel.find({}, function(err, cat) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(cat);
                    }
                });
            })
            .then((saved) => {

                // send mail testing
                // sendEmail("", "elviscoly2017@gmail.com", "sddsdfsf", "255553", "53626");
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}


function sendEmail(emailLinks, emailaddress, temporaryPassword, cooperId, name, passToken) {

    //nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        name: 'smtp.mailtrap.io',
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '9ff44127747437', // generated ethereal user
            pass: 'e4af102b0ba97a' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'info@peerxmatch.com', // sender address
        to: `'${emailaddress}'`, // list of receivers
        subject: 'Account Creation', // Subject line

        html: `'
            Hi ${name}, <br/>
            <p>Thank you for signing up with CooperSwitch. Your login details are as follow:</p>
           <b>Cooper ID: ${cooperId}</b> <br/>
           <b>Password: ${temporaryPassword}</b> <br/>
           <p>The first time you log in, follow the instructions to create a new password for your account.</p>
           <p>Thanks,</p><br/>
           <p>Team CooperSwitch</p>'` // html body
    };

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


module.exports = CategoryHandler;