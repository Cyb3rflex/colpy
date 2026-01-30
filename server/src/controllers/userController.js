const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { enrollments: true },
                },
            },
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: {
                enrollments: {
                    include: {
                        course: true
                    }
                },
                submissions: true,
                progress: true,
            },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (user) {
            const updatedUser = await prisma.user.update({
                where: { id: req.user.id },
                data: {
                    name: req.body.name || user.name,
                    email: req.body.email || user.email,
                    avatar: req.body.avatar || user.avatar,
                    title: req.body.title || user.title,
                    bio: req.body.bio || user.bio,
                    // Password update could go here if needed
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    avatar: true,
                    title: true,
                    bio: true,
                }
            });

            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc    Get Facilitator (Admin) details
// @route   GET /api/users/facilitator
// @access  Private
exports.getFacilitator = async (req, res) => {
    try {
        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
            select: {
                name: true,
                email: true,
                avatar: true,
                title: true,
                bio: true,
            },
        });

        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'Facilitator not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
