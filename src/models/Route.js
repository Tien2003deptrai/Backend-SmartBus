const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
    {
        stopId: { type: String, required: true },
        name: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [lng, lat]
                required: true,
            },
        },
        times: [{ type: String }],
    },
    { _id: false }
);

const routeSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        isHot: { type: Boolean, default: false },
        turnOnDay: { type: Number, default: 0 },
        startName: { type: String },
        endName: { type: String },
        stopsCount: { type: Number, default: 0 },
        stops: [stopSchema],
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

routeSchema.index({ 'stops.location': '2dsphere' });
routeSchema.index({ code: 1 });
routeSchema.index({ userId: 1 });
routeSchema.index({ name: 'text', description: 'text', startName: 'text', endName: 'text' });

module.exports = mongoose.model('Route', routeSchema);
