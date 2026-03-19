const express = require('express');
const auth = require('../middlewares/auth');
const ticketController = require('../controllers/ticketController');
const ticketValidation = require('../validations/ticketValidation');

const router = express.Router();
router.use(auth);

router.post(
    '/create',
    ticketValidation.createTicketRules,
    ticketValidation.validate,
    ticketController.createTicket
);

router.post(
    '/verify-scanned-qr',
    ticketValidation.verifyScannedQrRules,
    ticketValidation.validate,
    ticketController.verifyScannedQr
);

module.exports = router;
