const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const routeValidation = require('../validations/routeValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    routeValidation.createRouteRules,
    routeValidation.validate,
    routeController.createRoute
);

router.put(
    '/update/:id',
    auth,
    routeValidation.idParamRule,
    routeValidation.updateRouteRules,
    routeValidation.validate,
    routeController.updateRoute
);

router.delete(
    '/delete/:id',
    auth,
    routeValidation.idParamRule,
    routeValidation.validate,
    routeController.deleteRoute
);

router.post(
    '/listRoutes',
    routeValidation.listRouteRules,
    routeValidation.validate,
    routeController.listRoutes
);

router.get(
    '/detail/:id',
    routeValidation.idParamRule,
    routeValidation.validate,
    routeController.getRouteDetail
);

module.exports = router;
