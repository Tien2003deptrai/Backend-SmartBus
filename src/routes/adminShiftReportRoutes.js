const express = require('express');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const shiftReportController = require('../controllers/shiftReportController');
const shiftReportValidation = require('../validations/shiftReportValidation');

const router = express.Router();
router.use(auth);
router.use(requireAdmin);

router.post(
    '/',
    shiftReportValidation.adminListBodyRules,
    shiftReportValidation.validate,
    shiftReportController.getAdminShiftReports
);

router.patch(
    '/:reportId/review',
    shiftReportValidation.reviewRules,
    shiftReportValidation.validate,
    shiftReportController.reviewShiftReport
);

module.exports = router;
