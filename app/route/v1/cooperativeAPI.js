const router = require("express").Router();
const CooperativeAPIController = require(APP_CONTROLLER_PATH + "cooperativeAPI");
let cooperativeAPIController = new CooperativeAPIController();

console.log("Reaching Cooperative API");
router.get("/:id", cooperativeAPIController.get);
router.get("/", cooperativeAPIController.getAll);
router.post("/", cooperativeAPIController.create);
router.put("/", cooperativeAPIController.update);

module.exports = router;
