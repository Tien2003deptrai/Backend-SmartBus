const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const paymentMethodValidation = require('../validations/paymentMethodValidation');
const auth = require('../middlewares/auth');
router.use(auth);

router.post(
    '/create',
    paymentMethodValidation.createPaymentMethodRules,
    paymentMethodValidation.validate,
    paymentMethodController.createPaymentMethod
);

router.put(
    '/update/:id',
    paymentMethodValidation.idParamRule,
    paymentMethodValidation.updatePaymentMethodRules,
    paymentMethodValidation.validate,
    paymentMethodController.updatePaymentMethod
);

router.get(
    '/my-payment-methods',
    paymentMethodController.getMyPaymentMethods
);

module.exports = router;
