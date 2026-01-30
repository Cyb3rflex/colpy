const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all courses (Public view + Drafts for Admin)
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            where: req.user && req.user.role === 'ADMIN' ? {} : { isPublished: true },
            include: {
                _count: {
                    select: { modules: true, enrollments: true },
                },
            },
        });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single course details
// @route   GET /api/courses/:id
// @access  Public (Basic info), Private (Content)
exports.getCourse = async (req, res) => {
    try {
        const course = await prisma.course.findUnique({
            where: { id: req.params.id },
            include: {
                modules: {
                    include: {
                        units: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
    const { title, description, price, level } = req.body;

    try {
        const course = await prisma.course.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                level,
            },
        });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
    try {
        const course = await prisma.course.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
    try {
        await prisma.course.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Course removed' });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Add Module to Course
// @route   POST /api/courses/:courseId/modules
// @access  Private/Admin
exports.addModule = async (req, res) => {
    const { title, order } = req.body;
    try {
        const module = await prisma.module.create({
            data: {
                title,
                order: parseInt(order),
                courseId: req.params.courseId,
            },
        });
        res.status(201).json(module);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add Unit to Module
// @route   POST /api/modules/:moduleId/units
// @access  Private/Admin
exports.addUnit = async (req, res) => {
    const { title, type, content, assetUrl } = req.body;
    try {
        const unit = await prisma.unit.create({
            data: {
                title,
                type,
                content,
                assetUrl,
                moduleId: req.params.moduleId,
            },
        });
        res.status(201).json(unit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
