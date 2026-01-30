const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
exports.enrollInCourse = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.id;

    try {
        // Check if course exists
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check if already enrolled
        const existing = await prisma.enrollment.findFirst({
            where: { courseId, userId }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        // Logic for Paid vs Free
        // For MVP, we approve all "Paid" request as Mock Payments
        // In real app: Verify stripe session here.

        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                courseId,
                status: 'ACTIVE'
            }
        });

        res.status(201).json({ success: true, message: 'Enrolled successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Check enrollment status
// @route   GET /api/enrollments/:courseId/check
// @access  Private
exports.checkEnrollment = async (req, res) => {
    try {
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                courseId: req.params.courseId,
                userId: req.user.id
            }
        });
        res.json({ enrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc    Get all enrolled courses for current user
// @route   GET /api/enrollments/my
// @access  Private
exports.getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: req.user.id },
            include: {
                course: {
                    include: {
                        _count: {
                            select: { modules: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Map to return course objects directly with enrollment info
        const courses = await Promise.all(enrollments.map(async (e) => {
            const course = e.course;

            // Get total units for this course
            const totalUnits = await prisma.unit.count({
                where: { module: { courseId: course.id } }
            });

            // Get completed units for this user in this course
            const completedUnits = await prisma.progress.count({
                where: {
                    userId: req.user.id,
                    isCompleted: true,
                    unit: { module: { courseId: course.id } }
                }
            });

            const progressPercentage = totalUnits > 0
                ? Math.round((completedUnits / totalUnits) * 100)
                : 0;

            return {
                ...course,
                enrollmentId: e.id,
                enrolledAt: e.createdAt,
                status: e.status,
                progress: progressPercentage
            };
        }));

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
