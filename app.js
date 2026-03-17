const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const stopRoutes = require('./src/routes/stopRoutes');
const routeReportRoutes = require('./src/routes/routeReportRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const adminUserRoutes = require('./src/routes/adminUserRoutes');
const suggestLocationRoutes = require('./src/routes/suggestLocationRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/route-reports', routeReportRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/suggest-locations', suggestLocationRoutes);
app.use('/api/trips', tripRoutes);

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'OK' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
});

module.exports = app;
