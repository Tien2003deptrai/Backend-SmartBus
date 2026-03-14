const userService = require('../services/userService');

async function register(req, res) {
    try {
        const result = await userService.register(req.body);
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function registerVerifyOtp(req, res) {
    try {
        const result = await userService.registerVerifyOtp(req.body);
        res.status(201).json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
}

async function updateUser(req, res) {
    try {
        const user = await userService.updateUser(req.user._id, req.body);
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    register,
    registerVerifyOtp,
    login,
    updateUser,
};
