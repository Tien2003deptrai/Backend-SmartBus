const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const reviewValidation = require('../validations/reviewValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    reviewValidation.createReviewRules,
    reviewValidation.validate,
    reviewController.createReview
);

router.put(
    '/update/:id',
    auth,
    reviewValidation.idParamRule,
    reviewValidation.updateReviewRules,
    reviewValidation.validate,
    reviewController.updateReview
);

router.delete(
    '/delete/:id',
    auth,
    reviewValidation.idParamRule,
    reviewValidation.validate,
    reviewController.deleteReview
);

router.post(
    '/listReviews',
    reviewValidation.listReviewRules,
    reviewValidation.validate,
    reviewController.listReviews
);

router.get(
    '/detail/:id',
    reviewValidation.idParamRule,
    reviewValidation.validate,
    reviewController.getReviewDetail
);

module.exports = router;
