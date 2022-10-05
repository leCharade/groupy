const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
// const isSameUser = require('../middlewares/is-same-user');
// const isNotSameUser = require('../middlewares/is-not-same-user');
// const multer = require('../middlewares/multer-config');

const postCtrl = require('../controllers/post')

router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/:message', auth, postCtrl.createPost);
// router.put('/:id', auth, isSameUser, multer, sauceCtrl.modifySauce);
// router.delete('/:id', auth, isSameUser, sauceCtrl.deleteSauce);
// router.post("/:id/like", auth, isNotSameUser, sauceCtrl.likeSauce);

module.exports = router;