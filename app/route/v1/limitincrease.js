const router = require("express").Router();
const LimitIncreaseController = require(APP_CONTROLLER_PATH + "limitincrease");
let limitIncreaseController = new LimitIncreaseController();

console.log("Reaching limit increase");
router.get("/:cooperId/:id", limitIncreaseController.get);
router.post("/cooperative/:cooperId/:id", limitIncreaseController.getLimitIncrease);
router.post("/cooperator/:id", limitIncreaseController.getLimitIncreaseAdmin);
router.get("/", limitIncreaseController.getAll);
router.post("/", limitIncreaseController.create);
router.put("/:id", limitIncreaseController.update);
router.delete("/:id", limitIncreaseController.remove);

module.exports = router;
