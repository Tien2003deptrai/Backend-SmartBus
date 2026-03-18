const { body, validationResult } = require('express-validator');

const ticketTypeValues = ['single', 'monthlySingleRoute', 'monthlyInterRoute'];

const createTicketRules = [
    body('routeId').isMongoId().withMessage('routeId khong hop le'),
    body('routeName').trim().notEmpty().withMessage('routeName la bat buoc'),
    body('startStopName').trim().notEmpty().withMessage('startStopName la bat buoc'),
    body('endStopName').trim().notEmpty().withMessage('endStopName la bat buoc'),
    body('ticketType')
        .trim()
        .isIn(ticketTypeValues)
        .withMessage('ticketType phai la single, monthlySingleRoute hoac monthlyInterRoute'),
    body('departureDate')
        .isISO8601()
        .withMessage('departureDate khong hop le')
        .toDate(),
    body('departureTime')
        .trim()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('departureTime phai theo dinh dang HH:mm'),
    body('seatQuantity')
        .isInt({ min: 1 })
        .withMessage('seatQuantity phai >= 1')
        .toInt(),
    body('customerName').trim().notEmpty().withMessage('customerName la bat buoc'),
    body('customerPhone').trim().notEmpty().withMessage('customerPhone la bat buoc'),
    body('paymentMethodId').isMongoId().withMessage('paymentMethodId khong hop le'),
    body('price').isFloat({ min: 0 }).withMessage('price phai >= 0').toFloat()
];

const verifyScannedQrRules = [
    body('qrCode')
        .trim()
        .notEmpty()
        .withMessage('qrCode la bat buoc')
        .isLength({ min: 5, max: 255 })
        .withMessage('qrCode khong hop le')
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    return next();
}

module.exports = {
    createTicketRules,
    verifyScannedQrRules,
    validate
};
