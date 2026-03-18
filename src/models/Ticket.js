const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            required: true,
            trim: true
        },
        routeName: {
            type: String,
            required: true,
            trim: true
        },
        startStopName: {
            type: String,
            required: true,
            trim: true
        },
        endStopName: {
            type: String,
            required: true,
            trim: true
        },
        ticketType: {
            type: String,
            enum: ['single', 'monthlySingleRoute', 'monthlyInterRoute'],
            required: true
        },
        // ngày đi
        departureDate: {
            type: Date,
            required: true
        },
        // giờ đi
        departureTime: {
            type: String,
            required: true,
            trim: true
        },
        seatQuantity: {
            type: Number,
            required: true,
            min: 1
        },
        customerName: {
            type: String,
            required: true,
            trim: true
        },
        customerPhone: {
            type: String,
            required: true,
            trim: true
        },
        // object payment_method
        paymentMethodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaymentMethod',
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        qrCode: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'active', 'used', 'expired', 'cancelled'],
            default: 'active'
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        },
        issueDate: {
            type: Date,
            default: Date.now
        },
        expiryDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Ticket', ticketSchema);
