const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// @desc    Initialize Payment with Paystack
// @route   POST /api/payments/initialize
// @access  Private
exports.initializePayment = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.price <= 0) {
            return res.status(400).json({ message: 'This course is free. Use direct enrollment.' });
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: { userId, courseId, status: 'ACTIVE' }
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const amount = Math.round(course.price * 100); // Amount in kobo

        // Call Paystack API
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email: userEmail,
                amount: amount,
                callback_url: `http://localhost:5173/student/course/${courseId}`,
                metadata: {
                    userId,
                    courseId
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.data.status) {
            return res.status(400).json({ message: 'Failed to initialize transaction' });
        }

        // Create Transaction record in PENDING status
        await prisma.transaction.create({
            data: {
                userId,
                courseId,
                amount: course.price,
                reference: response.data.data.reference,
                status: 'PENDING'
            }
        });

        res.json(response.data.data);

    } catch (error) {
        console.error('Paystack Initialize Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Payment initialization failed' });
    }
};

// @desc    Verify Payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    const { reference, courseId } = req.body;
    const userId = req.user.id;

    try {
        if (!reference) {
            return res.status(400).json({ message: 'No reference provided' });
        }

        // Call Paystack Verify API
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`
                }
            }
        );

        const data = response.data.data;

        if (data.status === 'success') {
            // Update Transaction
            await prisma.transaction.update({
                where: { reference: reference },
                data: { status: 'SUCCESSFUL' }
            });

            // Create Enrollment
            const enrollment = await prisma.enrollment.create({
                data: {
                    userId,
                    courseId,
                    status: 'ACTIVE'
                }
            });

            return res.json({
                status: 'success',
                message: 'Payment verified and enrollment active',
                enrollment
            });
        } else {
            // Update Transaction
            await prisma.transaction.update({
                where: { reference: reference },
                data: { status: 'FAILED' }
            });

            return res.status(400).json({
                status: 'failed',
                message: 'Payment verification failed'
            });
        }

    } catch (error) {
        console.error('Paystack Verify Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Payment verification error' });
    }
};
