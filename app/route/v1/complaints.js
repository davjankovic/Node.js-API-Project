const router = require('express').Router();
const ComplaintController = require(APP_CONTROLLER_PATH + 'complaints');
let complaintController = new ComplaintController();

console.log("Reaching Complaint");
router.get('/:id', complaintController.get);
router.get('/status/:id', complaintController.complaintsByStatus);
router.post("/bycooperid/:id", complaintController.getSingleComplaintByCooperId);
router.post("/vendor/:id", complaintController.getSingleComplaintByVendorId);
router.post("/cooperator", complaintController.createCooperatorComplaint);

router.get('/', complaintController.getAll);
router.post('/', complaintController.create);
router.put('/', complaintController.update);


// var multer = require('multer');

// var Storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//         callback(null, "public");
//     },
//     filename: function(req, file, callback) {
//         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     }
// });

// var upload = multer({ storage: Storage }).single("image"); //Field name and max count


// router.post("/upload", function(req, res) {
//     console.log("Reaching Upload" + req.filename);
//     upload(req, res, function(err) {
//         if (err) {
//             return res.end("Something went wrong!");

//             console.log("Reaching Upload error " + err);
//         }

//         console.log("Reaching Upload Success " + req.file);
//         return res.end("File uploaded sucessfully!.");
//     });
// });








module.exports = router;