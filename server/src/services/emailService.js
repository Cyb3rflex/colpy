const { Resend } = require('resend');
const dotenv = require('dotenv');


const clientUrl = process.env.CLIENT_URL;

dotenv.config();

// Initialize Resend with API Key (mock usage if not present)
// In production, ensure RESEND_API_KEY is allowed for the domain
if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (email, name) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'CyberSec Platform <hello@colpy.online>', // Use verified domain in prod
            to: [email],
            subject: 'Welcome to CyberSec Elite',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; background-color: #f9fafb; border-radius: 8px;">
            <h1 style="color: #0891b2;">Welcome, ${name}!</h1>
            <p>You have successfully joined the platform. Get ready to master cybersecurity with our elite training modules.</p>
            <p style="margin-top: 20px;">Go to your <a href="${clientUrl}/student" style="color: #0891b2; font-weight: bold; text-decoration: none;">Dashboard</a> to start learning.</p>
        </div>
      `
        });

        if (error) {
            console.error('Resend Welcome Email Error:', JSON.stringify(error, null, 2));
            return false;
        }
        return true;
    } catch (err) {
        console.error('Email Dispatch Failed:', err);
        return false;
    }
};

const sendVerificationEmail = async (email, name, token) => {
    try {
        const verifyUrl = `${clientUrl}/verify?token=${token}`;
        const { data, error } = await resend.emails.send({
            from: 'CyberSec Platform <verify@colpy.online>',
            to: [email],
            subject: 'Verify your email - CyberSec Platform',
            html: `
        <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827; margin-bottom: 24px;">Confirm your email address</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 32px;">
                Hello ${name},<br><br>
                Thank you for joining CyberSec Platform! To complete your registration and secure your account, please verify your email address.
            </p>
            <a href="${verifyUrl}" style="display: inline-block; background-color: #0891b2; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; text-align: center;">Verify Email Address</a>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 32px; line-height: 1.6;">
                If you didn't create an account, you can safely ignore this email.<br>
                Verification link expires in 24 hours.
            </p>
        </div>
      `
        });

        if (error) {
            console.error('Resend Verification Email Error:', JSON.stringify(error, null, 2));
            return false;
        }
        return true;
    } catch (err) {
        console.error('Verification Email Failed:', err);
        return false;
    }
};

const sendPasswordResetEmail = async (email, name, token) => {
    try {
        const resetUrl = `${clientUrl}/reset-password/${token}`;
        const { data, error } = await resend.emails.send({
            from: 'CyberSec Platform <resetpassword@colpy.online>',
            to: [email],
            subject: 'Reset your password - CyberSec Platform',
            html: `
        <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827; margin-bottom: 24px;">Reset your password</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 32px;">
                Hello ${name},<br><br>
                You requested a password reset for your CyberSec Platform account. Click the button below to set a new password.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #0891b2; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; text-align: center;">Reset Password</a>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 32px; line-height: 1.6;">
                If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.<br>
                If the button doesn't work, copy and paste this link into your browser: ${resetUrl}
            </p>
        </div>
      `
        });

        if (error) {
            console.error('Resend Reset Email Error:', JSON.stringify(error, null, 2));
            return false;
        }
        return true;
    } catch (err) {
        console.error('Reset Email Failed:', err);
        return false;
    }
};

module.exports = { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail };
