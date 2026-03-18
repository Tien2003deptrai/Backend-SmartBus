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
        return 'QR code không tồn tại';
    }

    if (ticket.status === 'cancelled') {
        return 'Vé đã bị hủy';
    }

    if (ticket.status === 'used') {
        return 'Vé đã được sử dụng';
    }

    if (ticket.status === 'expired') {
        return 'Vé đã hết hạn';
    }

    if (ticket.expiryDate && ticket.expiryDate.getTime() < Date.now()) {
        return 'Vé đã hết hạn';
    }

    if (!VALID_VERIFY_STATUSES.has(ticket.status)) {
        return `Vé không hợp lệ với trạng thái ${ticket.status}`;
    }

    return null;
}

async function createTicket(userId, data) {
    const route = await Route.findById(data.routeId).select('_id');
    if (!route) {
        throw new Error('Tuyến không tồn tại');
    }

    const paymentMethod = await PaymentMethod.findOne({
        _id: data.paymentMethodId,
        user: userId
    }).select('_id');
    if (!paymentMethod) {
        throw new Error('Phương thức thanh toán không tồn tại hoặc không thuộc về bạn');
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

    throw new Error('Không thể tạo vé');
}

async function verifyScannedQr(scannerUserId, data, context = {}) {
    const qrCode = String(data.qrCode || '').trim();

    const ticket = await Ticket.findOne({ qrCode }).select(
        '_id user routeId routeName startStopName endStopName ticketType departureDate departureTime seatQuantity customerName customerPhone price status purchaseDate issueDate expiryDate usedAt qrCode'
    );

    const invalidReason = getInvalidReason(ticket);
    const isValid = !invalidReason;
    const reason = invalidReason || 'QR code hợp lệ';

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
