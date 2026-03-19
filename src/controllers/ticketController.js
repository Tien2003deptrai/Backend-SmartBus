const ticketService = require('../services/ticketService');

async function createTicket(req, res) {
    try {
        const ticket = await ticketService.createTicket(req.user._id, req.body);
        return res.status(201).json({
            success: true,
            message: 'Tạo vé thành công',
            data: ticket
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function verifyScannedQr(req, res) {
    try {
        const result = await ticketService.verifyScannedQr(req.user?._id, req.body);

        return res.json({
            success: true,
            message: result.isValid ? 'QR code hợp lệ' : 'QR code không hợp lệ',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createTicket,
    verifyScannedQr
};
