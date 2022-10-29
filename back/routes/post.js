const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const allowEdit = require('../middlewares/allow-edit');
// const allowLike = require('../middlewares/allow-like');
const multer = require('../middlewares/multer-config');

const postCtrl = require('../controllers/post')

router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, postCtrl.createPost);
router.post('/:id', auth, postCtrl.replyPost)
router.put('/:id', auth, allowEdit, postCtrl.modifyPost);
// router.delete('/:id', auth, allowEdit, postCtrl.deletePost);
// router.post("/:id/like", auth, allowLike, postCtrl.likePost);

module.exports = router;