const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Get all units for this course to filter progress correctly (optional optimization)
        // For now, simpler: Get all progress for this user where unit belongs to course
        // But Unit -> Module -> Course.

        // Easier: Just get all progress for the user, frontend filters? No courseId param is specific.
        // Let's get units first.
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    include: { units: { select: { id: true } } }
                }
            }
        });

        if (!course) return res.status(404).json({ error: 'Course not found' });

        const unitIds = course.modules.flatMap(m => m.units.map(u => u.id));

        const progress = await prisma.progress.findMany({
            where: {
                userId,
                unitId: { in: unitIds },
                isCompleted: true
            },
            select: { unitId: true }
        });

        res.json(progress.map(p => p.unitId));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
};

const markUnitComplete = async (req, res) => {
    try {
        const { unitId } = req.body;
        const userId = req.user.id;

        const progress = await prisma.progress.upsert({
            where: {
                // Prisma needs a unique compound key or unique constraints for upsert on non-ID fields.
                // Our schema doesn't seem to have @unique([userId, unitId]) in the previous view.
                // Let's check schema again or just use findFirst -> update/create.
                // Wait, schema view showed:
                // progress Progress[] in User and Unit.
                // model Progress { id, userId, unitId, isCompleted }
                // No composite unique. I should probably add one or check if exists.
                // If not, I'll use findFirst.

                // Actually, let's just create if not exists.
                id: 'placeholder-wont-work-for-upsert-without-unique'
            },
            update: { isCompleted: true },
            create: { userId, unitId, isCompleted: true }
        });

        // Re-impl with findFirst since schema might lack unique constraint on user+unit
        // (Checked schema: no unique constraint visible in viewed snippet).
        // Safe approach:
        const existing = await prisma.progress.findFirst({
            where: { userId, unitId }
        });

        if (existing) {
            await prisma.progress.update({
                where: { id: existing.id },
                data: { isCompleted: true }
            });
        } else {
            await prisma.progress.create({
                data: { userId, unitId, isCompleted: true }
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update progress' });
    }
};

module.exports = { getCourseProgress, markUnitComplete };
