const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'CyberSec Platform <cybrflex@gmail.com>',
            to: ['abdulmuheezq@gmail.com'],
            subject: 'Updated Sender Test',
            html: '<p>Testing with new Gmail sender.</p>'
        });

        if (error) {
            console.error('RESEND ERROR:', JSON.stringify(error, null, 2));
        } else {
            console.log('SUCCESS:', data);
        }
    } catch (err) {
        console.error('CRITICAL FAILURE:', err);
    }
}

testEmail();
