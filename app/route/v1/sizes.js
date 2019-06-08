const router = require("express").Router();
const SizeController = require(APP_CONTROLLER_PATH + "sizes");
let sizeController = new SizeController();

console.log("Reaching Sizes");
router.get("/:id", sizeController.getSize);
router.get("/", sizeController.getAll);
router.post("/", sizeController.create);
router.put("/:id", sizeController.update);
router.delete("/:id", sizeController.remove);

module.exports = router;
