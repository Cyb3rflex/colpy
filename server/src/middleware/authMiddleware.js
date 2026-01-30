const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, role: true, email: true, name: true },
            });

            if (req.user) {
                req.user.userId = req.user.id; // Compatibility for controllers using userId
            }

            if (!req.user) {
                console.log(`[Auth] User not found for ID: ${decoded.id}`);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            console.log(`[Auth] User authorized: ${req.user.email} (${req.user.role})`);
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        console.log(`[Admin] Forbidden access attempt by: ${req.user?.email} (Role: ${req.user?.role}) (Full User: ${JSON.stringify(req.user)})`);
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
