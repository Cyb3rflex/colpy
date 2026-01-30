const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Submit assignment/classwork
// @route   POST /api/units/:unitId/submit
// @access  Private
// @desc    Submit assignment/classwork/quiz
// @route   POST /api/units/:unitId/submit
// @access  Private
exports.submitWork = async (req, res) => {
    const { content } = req.body; // Answers JSON
    const { unitId } = req.params;
    const userId = req.user.id;

    try {
        const unit = await prisma.unit.findUnique({
            where: { id: unitId },
            include: { module: { include: { course: true } } }
        });

        if (!unit) return res.status(404).json({ message: 'Unit not found' });

        // --- ATTEMPT LIMITS & PREVIOUS PASS CHECK ---
        const previousSubmissions = await prisma.submission.findMany({
            where: { userId, unitId },
            orderBy: { createdAt: 'desc' }
        });

        const attemptCount = previousSubmissions.length;

        // --- ATTEMPT LIMITS & PREVIOUS PASS CHECK ---
        let passThreshold = 70; // Default for QUIZ
        let maxAttempts = 2;    // Default for QUIZ

        if (unit.type === 'TEST') {
            passThreshold = 75;
            maxAttempts = 2;
        } else if (unit.type === 'EXAM') {
            passThreshold = 80;
            maxAttempts = 1;
        }

        const hasPassed = previousSubmissions.some(s => s.score !== null && s.score >= passThreshold);

        if (['QUIZ', 'TEST', 'EXAM'].includes(unit.type)) {
            if (hasPassed) {
                return res.status(400).json({ message: `You have already passed this ${unit.type.toLowerCase()} and cannot retake it.` });
            }
            if (attemptCount >= maxAttempts) {
                return res.status(400).json({ message: `Maximum attempts reached (${maxAttempts}/${maxAttempts}).` });
            }
        }

        // --- AUTO-GRADING LOGIC ---
        let autoScore = null;
        let needsManualGrading = false;

        if (['QUIZ', 'TEST', 'EXAM'].includes(unit.type)) {
            try {
                const quizData = JSON.parse(unit.content);
                const userAnswers = typeof content === 'string' ? JSON.parse(content) : content;

                let totalGradable = 0;
                let correctGradable = 0;

                // Grade Section A (MCQ)
                if (quizData.section_a?.questions) {
                    quizData.section_a.questions.forEach(q => {
                        totalGradable++;
                        if (userAnswers.section_a?.[q.id] === q.answer) {
                            correctGradable++;
                        }
                    });
                }

                // Grade Section B (T/F)
                if (quizData.section_b?.questions) {
                    quizData.section_b.questions.forEach(q => {
                        totalGradable++;
                        if (userAnswers.section_b?.[q.id] === q.answer) {
                            correctGradable++;
                        }
                    });
                }

                // Check Section C (Short Answer)
                if (quizData.section_c?.questions && quizData.section_c.questions.length > 0) {
                    needsManualGrading = true;
                }

                if (totalGradable > 0) {
                    autoScore = Math.round((correctGradable / totalGradable) * 100);
                } else if (!needsManualGrading) {
                    autoScore = 100;
                }

            } catch (e) {
                console.error('Grading error:', e);
                needsManualGrading = true;
            }
        } else if (unit.type === 'ASSIGNMENT') {
            needsManualGrading = true;
        }

        const submission = await prisma.submission.create({
            data: {
                userId,
                unitId,
                content: typeof content === 'string' ? content : JSON.stringify(content),
                score: autoScore,
                status: needsManualGrading ? 'PENDING' : 'COMPLETED',
            },
        });

        // Mark progress as completed if passed or completed
        const isPassedResult = autoScore !== null ? autoScore >= passThreshold : false;

        if (!needsManualGrading && (unit.type === 'TEXT' || unit.type === 'VIDEO' || isPassedResult)) {
            await prisma.progress.upsert({
                where: {
                    userId_unitId: { userId, unitId }
                },
                update: { isCompleted: true },
                create: { userId, unitId, isCompleted: true }
            });
        }

        res.status(201).json({
            ...submission,
            attemptsUsed: attemptCount + 1,
            maxAttempts,
            passThreshold,
            message: needsManualGrading
                ? 'Submission received. Review of short-answers pending.'
                : (isPassedResult || (unit.type !== 'QUIZ' && unit.type !== 'TEST' && unit.type !== 'EXAM')
                    ? `Success! Your score: ${autoScore}% (Min: ${passThreshold}%)`
                    : `Attempt ${attemptCount + 1}/${maxAttempts} complete. Score: ${autoScore}% (Min: ${passThreshold}%). Try again?`)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Grade submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Admin
// @desc    Grade submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Admin
exports.gradeWork = async (req, res) => {
    const { score, feedback } = req.body;

    try {
        const submission = await prisma.submission.update({
            where: { id: req.params.id },
            data: {
                score,
                feedback,
                status: 'COMPLETED'
            },
        });

        // Mark unit as completed in Progress after manual grading
        await prisma.progress.upsert({
            where: {
                userId_unitId: {
                    userId: submission.userId,
                    unitId: submission.unitId
                }
            },
            update: { isCompleted: true },
            create: {
                userId: submission.userId,
                unitId: submission.unitId,
                isCompleted: true
            }
        });

        res.json(submission);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get submission by ID (Admin view)
// @route   GET /api/submissions/:id
// @access  Private/Admin
exports.getSubmissionById = async (req, res) => {
    try {
        const submission = await prisma.submission.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { name: true, email: true } },
                unit: { select: { title: true, content: true, type: true } }
            }
        });
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        res.json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get submissions for a unit (Admin view)
// @route   GET /api/units/:unitId/submissions
// @access  Private/Admin
exports.getSubmissionsByUnit = async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            where: { unitId: req.params.unitId },
            include: { user: { select: { name: true, email: true } } }
        });
        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc    Get all pending submissions (Admin view)
// @route   GET /api/submissions/pending
// @access  Private/Admin
exports.getPendingSubmissions = async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            where: { status: 'PENDING' },
            include: {
                user: { select: { name: true, email: true } },
                unit: { select: { title: true, module: { select: { course: { select: { title: true } } } } } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc    Get current user's submission for a unit
// @route   GET /api/units/:unitId/my-submission
// @access  Private
exports.getMySubmission = async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            where: {
                unitId: req.params.unitId,
                userId: req.user.id
            },
            orderBy: { createdAt: 'desc' }
        });

        const latestSubmission = submissions[0] || null;
        const attemptCount = submissions.length;

        const unit = await prisma.unit.findUnique({ where: { id: req.params.unitId } });
        let passThreshold = 70;
        let maxAttempts = 2;

        if (unit?.type === 'TEST') {
            passThreshold = 75;
            maxAttempts = 2;
        } else if (unit?.type === 'EXAM') {
            passThreshold = 80;
            maxAttempts = 1;
        }

        const hasPassed = submissions.some(s => s.score !== null && s.score >= passThreshold);

        res.json({
            ...latestSubmission,
            attemptCount,
            hasPassed,
            maxAttempts,
            passThreshold
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
