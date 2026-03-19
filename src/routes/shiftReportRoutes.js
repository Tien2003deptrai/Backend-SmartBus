const express = require('express');
const auth = require('../middlewares/auth');
const shiftReportController = require('../controllers/shiftReportController');
const shiftReportValidation = require('../validations/shiftReportValidation');
const requireStaff = require('../middlewares/requireStaff');

const router = express.Router();
router.use(auth);
router.use(requireStaff);

router.post(
    '/preview',
    shiftReportValidation.previewAndSubmitRules,
    shiftReportValidation.validate,
    shiftReportController.previewShiftStats
);

router.post(
    '/submit',
    shiftReportValidation.previewAndSubmitRules,
    shiftReportValidation.validate,
    shiftReportController.submitShiftReport
);

router.post(
    '/my',
    shiftReportValidation.myReportBodyRules,
    shiftReportValidation.validate,
    shiftReportController.getMyShiftReports
);

module.exports = router;
