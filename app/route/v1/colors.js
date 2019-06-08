const router = require("express").Router();
const ColorController = require(APP_CONTROLLER_PATH + "colors");
let colorController = new ColorController();

console.log("Reaching Colors");
router.get("/:id", colorController.getColor);
router.get("/", colorController.getAll);
router.post("/", colorController.create);
router.put("/:id", colorController.update);
router.delete("/:id", colorController.remove);

module.exports = router;
