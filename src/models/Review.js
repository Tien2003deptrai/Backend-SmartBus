const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        content: { type: String, default: '' },
    },
    { timestamps: true }
);

reviewSchema.index({ routeId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model('Review', reviewSchema);
