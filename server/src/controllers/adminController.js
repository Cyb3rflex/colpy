const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: 'STUDENT' },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                title: true,
                bio: true,
                createdAt: true,
                enrollments: {
                    include: {
                        course: {
                            include: {
                                modules: {
                                    include: { units: true } // Need to count units
                                }
                            }
                        }
                    }
                },
                progress: true // Need to count completed units
            }
        });

        // Transform data to simple stats
        const studentData = students.map(student => {
            const courses = student.enrollments.map(enrollment => {
                const course = enrollment.course;
                const totalUnits = course.modules.reduce((acc, mod) => acc + mod.units.length, 0);

                // Count progress for this course ONLY
                const courseUnitIds = course.modules.flatMap(m => m.units.map(u => u.id));
                const completedCount = student.progress.filter(p => courseUnitIds.includes(p.unitId) && p.isCompleted).length;

                const percent = totalUnits === 0 ? 0 : Math.min(100, Math.round((completedCount / totalUnits) * 100));

                return {
                    id: course.id,
                    title: course.title,
                    progress: percent,
                    status: percent === 100 ? 'Completed' : (percent > 0 ? 'In Progress' : 'Not Started')
                };
            });

            return {
                id: student.id,
                name: student.name,
                email: student.email,
                avatar: student.avatar,
                title: student.title,
                bio: student.bio,
                joinedAt: student.createdAt,
                courses
            };
        });

        res.json(studentData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to load students' });
    }
};

module.exports = { getAllStudents };
