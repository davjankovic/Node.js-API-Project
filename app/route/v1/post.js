/**
 *  Created by Accelerar on 3/6/2018.
 */
const router = require('express').Router();
const PostController = require(APP_CONTROLLER_PATH + 'post');
let postController = new PostController();
console.log("Reaching Post");
router.get('/', postController.getAll);
router.get('/:id', postController.get);
router.post('/', postController.create);
router.delete('/:id', postController.remove);
router.put('/:id', postController.update);

module.exports = router;