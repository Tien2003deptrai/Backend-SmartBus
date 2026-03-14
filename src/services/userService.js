const User = require('../models/User');
const PendingRegistration = require('../models/PendingRegistration');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { generateOtp } = require('../utils/otpStorage');
const { sendOtpEmail } = require('../utils/emailService');

const OTP_EXPIRY_MS = 60 * 1000;

async function register(data) {
    const { full_name, email, phone, password } = data;
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error('Email đã được đăng ký');
    }
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    await PendingRegistration.deleteOne({ email });
    await PendingRegistration.create({
        email,
        full_name,
        phone,
        password,
        otpCode,
        expiresAt,
    });
    await sendOtpEmail(email, otpCode);
    return { message: 'OTP đã được gửi đến email. Hiệu lực 1 phút.' };
}

async function registerVerifyOtp(data) {
    const otp = String(data.otp || '').trim();
    const pending = await PendingRegistration.findOne({ otpCode: otp });
    if (!pending) {
        throw new Error('OTP không hợp lệ');
    }
    if (pending.expiresAt < new Date()) {
        await PendingRegistration.deleteOne({ _id: pending._id });
        throw new Error('Phiên đăng ký đã hết hạn. Vui lòng gửi lại OTP.');
    }
    const exists = await User.findOne({ email: pending.email });
    if (exists) {
        await PendingRegistration.deleteOne({ _id: pending._id });
        throw new Error('Email đã được đăng ký');
    }
    const user = await User.create({
        full_name: pending.full_name,
        email: pending.email,
        phone: pending.phone,
        password: pending.password,
    });
    await PendingRegistration.deleteOne({ _id: pending._id });
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
    const safe = user.toObject();
    delete safe.password;
    return { user: safe, token };
}

async function login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
    const safe = user.toObject();
    delete safe.password;
    return { user: safe, token };
}

async function updateUser(userId, data) {
    const updates = { ...data };
    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
    } else {
        delete updates.password;
    }
    delete updates.email;
    const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
    });
    if (!user) throw new Error('User không tồn tại');
    return user;
}

module.exports = {
    register,
    registerVerifyOtp,
    login,
    updateUser,
};
