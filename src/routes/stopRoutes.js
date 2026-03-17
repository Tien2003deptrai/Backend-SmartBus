const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const stopValidation = require('../validations/stopValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    stopValidation.createStopRules,
    stopValidation.validate,
    stopController.createStop
);

router.put(
    '/update/:id',
    auth,
    stopValidation.idParamRule,
    stopValidation.updateStopRules,
    stopValidation.validate,
    stopController.updateStop
);

router.delete(
    '/delete/:id',
    auth,
    stopValidation.idParamRule,
    stopValidation.validate,
    stopController.deleteStop
);

router.post(
    '/listByRoute',
    stopValidation.listStopsByRouteRules,
    stopValidation.validate,
    stopController.listStopsByRoute
);

router.get(
    '/detail/:id',
    stopValidation.idParamRule,
    stopValidation.validate,
    stopController.getStopDetail
);

module.exports = router;
