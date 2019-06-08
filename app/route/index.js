/**
 *  Created by Accelerar on 3/6/2018.
 */
const express = require('express'),
    router = express.Router();
// API V1
router.use('/v1', require(APP_ROUTE_PATH + 'v1'));

module.exports = router;