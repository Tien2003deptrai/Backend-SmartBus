const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema(
    {
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            default: null
        },
        qrCode: {
            type: String,
            required: true,
            trim: true
        },
        isValid: {
            type: Boolean,
            required: true
        },
        reason: {
            type: String,
            default: ''
        },
        scannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    {
        timestamps: true
    }
);

scanLogSchema.index({ qrCode: 1 });
scanLogSchema.index({ ticket: 1 });
scanLogSchema.index({ scannedBy: 1 });
scanLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ScanLog', scanLogSchema);
