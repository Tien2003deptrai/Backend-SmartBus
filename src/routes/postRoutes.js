const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postValidation = require('../validations/postValidation');
const auth = require('../middlewares/auth');

router.post(
    '/',
    auth,
    postValidation.createPostRules,
    postValidation.validate,
    postController.createPost
);

router.put(
    '/:id',
    auth,
    postValidation.idParamRule,
    postValidation.updatePostRules,
    postValidation.validate,
    postController.updatePost
);

router.delete(
    '/:id',
    auth,
    postValidation.idParamRule,
    postValidation.validate,
    postController.deletePost
);

router.post(
    '/listPosts',
    postValidation.listPostRules,
    postValidation.validate,
    postController.listPosts
);

router.get(
    '/:id',
    postValidation.idParamRule,
    postValidation.validate,
    postController.getPostDetail
);

module.exports = router;
