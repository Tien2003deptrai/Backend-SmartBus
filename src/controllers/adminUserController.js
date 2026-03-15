const adminUserService = require('../services/adminUserService');

async function getListUser(req, res) {
    try {
        const { page, limit, search, role, is_priority_user, active } = req.body;
        const result = await adminUserService.listUsers({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search,
            role,
            is_priority_user,
            active,
        });
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getUserDetail(req, res) {
    try {
        const user = await adminUserService.getUserById(req.params.id);
        res.json({ success: true, user });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}

async function updateUserActive(req, res) {
    try {
        const user = await adminUserService.updateUserActive(req.params.id, req.body.active);
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        await adminUserService.deleteUserById(req.params.id, req.user._id);
        res.json({ success: true, message: 'Đã xóa tài khoản' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    getListUser,
    getUserDetail,
    updateUserActive,
    deleteUser,
};
