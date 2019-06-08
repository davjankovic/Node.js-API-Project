/**
 *  Created by Accelerar on 3/6/2018.
 */
const router = require('express').Router();
const AuditTrailController = require(APP_CONTROLLER_PATH + 'auditTrail');
let auditTrailController = new AuditTrailController();


router.get('/:id', auditTrailController.get);
router.post('/', auditTrailController.create);

module.exports = router;