const express = require('express');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const shiftReportController = require('../controllers/shiftReportController');
const shiftReportValidation = require('../validations/shiftReportValidation');

const router = express.Router();

router.get(
    '/',
    auth,
    requireAdmin,
    shiftReportValidation.adminListQueryRules,
    shiftReportValidation.validate,
    shiftReportController.getAdminShiftReports
);

router.patch(
    '/:reportId/review',
    auth,
    requireAdmin,
    shiftReportValidation.reviewRules,
    shiftReportValidation.validate,
    shiftReportController.reviewShiftReport
);

module.exports = router;
