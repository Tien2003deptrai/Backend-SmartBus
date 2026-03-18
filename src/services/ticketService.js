const crypto = require('crypto');
const QRCode = require('qrcode');

const Ticket = require('../models/Ticket');
const Route = require('../models/Route');
const PaymentMethod = require('../models/PaymentMethod');
const ScanLog = require('../models/ScanLog');

const VALID_VERIFY_STATUSES = new Set(['paid', 'active']);

function generateQrCodeText() {
    return `TICKET-${crypto.randomUUID()}`;
}

function getInvalidReason(ticket) {
    if (!ticket) {
        return 'QR code khong ton tai';
    }

    if (ticket.status === 'cancelled') {
        return 'Ve da bi huy';
    }

    if (ticket.status === 'used') {
        return 'Ve da duoc su dung';
    }

    if (ticket.status === 'expired') {
        return 'Ve da het han';
    }

    if (ticket.expiryDate && ticket.expiryDate.getTime() < Date.now()) {
        return 'Ve da het han';
    }

    if (!VALID_VERIFY_STATUSES.has(ticket.status)) {
        return `Ve khong hop le voi trang thai ${ticket.status}`;
    }

    return null;
}

async function createTicket(userId, data) {
    const route = await Route.findById(data.routeId).select('_id');
    if (!route) {
        throw new Error('Tuyen khong ton tai');
    }

    const paymentMethod = await PaymentMethod.findOne({
        _id: data.paymentMethodId,
        user: userId
    }).select('_id');
    if (!paymentMethod) {
        throw new Error('Phuong thuc thanh toan khong ton tai hoac khong thuoc ve ban');
    }

    for (let attempt = 0; attempt < 3; attempt++) {
        const qrCode = generateQrCodeText();
        const qrCodeImage = await QRCode.toDataURL(qrCode, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            margin: 2,
            width: 320
        });

        try {
            const ticket = await Ticket.create({
                ...data,
                user: userId,
                qrCode,
                qrCodeImage
            });
            return ticket;
        } catch (error) {
            const isDuplicateQr = error?.code === 11000 && error?.keyPattern?.qrCode;
            if (!isDuplicateQr || attempt === 2) {
                throw error;
            }
        }
    }

    throw new Error('Khong the tao ve');
}

async function verifyScannedQr(scannerUserId, data, context = {}) {
    const qrCode = String(data.qrCode || '').trim();

    const ticket = await Ticket.findOne({ qrCode }).select(
        '_id user routeId routeName startStopName endStopName ticketType departureDate departureTime seatQuantity customerName customerPhone price status purchaseDate issueDate expiryDate usedAt qrCode'
    );

    const invalidReason = getInvalidReason(ticket);
    const isValid = !invalidReason;
    const reason = invalidReason || 'QR code hop le';

    const scanLog = await ScanLog.create({
        ticket: ticket?._id || null,
        qrCode,
        isValid,
        reason,
        scannedBy: scannerUserId || null,
        sourceIp: context.sourceIp || '',
        userAgent: context.userAgent || ''
    });

    return {
        isValid,
        reason,
        ticket,
        scanLogId: scanLog._id
    };
}

module.exports = {
    createTicket,
    verifyScannedQr
};
