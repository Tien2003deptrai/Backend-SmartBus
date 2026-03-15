const express = require('express');
const router = express.Router();
const routeReportController = require('../controllers/routeReportController');
const routeReportValidation = require('../validations/routeReportValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    routeReportValidation.createRouteReportRules,
    routeReportValidation.validate,
    routeReportController.createRouteReport
);

router.put(
    '/update/:id',
    auth,
    routeReportValidation.idParamRule,
    routeReportValidation.updateRouteReportRules,
    routeReportValidation.validate,
    routeReportController.updateRouteReport
);

router.delete(
    '/delete/:id',
    auth,
    routeReportValidation.idParamRule,
    routeReportValidation.validate,
    routeReportController.deleteRouteReport
);

router.post(
    '/listRouteReports',
    routeReportValidation.listRouteReportRules,
    routeReportValidation.validate,
    routeReportController.listRouteReports
);

router.get(
    '/detail/:id',
    auth,
    routeReportValidation.idParamRule,
    routeReportValidation.validate,
    routeReportController.getRouteReportDetail
);

module.exports = router;
