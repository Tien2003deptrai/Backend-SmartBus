const nodemailer = require('nodemailer');
const config = require('../config');
const { getOtpEmailHtml } = require('./emailTemplates');

let transporter = null;
if (config.smtp.host && config.smtp.user && config.smtp.pass) {
    transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.pass,
        },
    });
}

async function sendOtpEmail(to, otp) {
    if (!transporter) {
        console.warn('[Email] SMTP chưa cấu hình - OTP gửi đến', to, ':', otp);
        return { success: true };
    }
    try {
        await transporter.sendMail({
            from: config.smtp.from,
            to,
            subject: `Mã xác nhận đăng ký - Smart Bus`,
            html: getOtpEmailHtml(otp),
        });
        console.log('[Email] Đã gửi OTP đến', to);
        return { success: true };
    } catch (err) {
        console.error('[Email] Lỗi gửi mail:', err.message);
        console.warn('[Email] OTP (dùng để test):', otp);
        throw new Error('Không thể gửi email. Kiểm tra SMTP hoặc thư mục Spam.');
    }
}

module.exports = { sendOtpEmail };
