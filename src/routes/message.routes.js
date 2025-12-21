const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const messageController = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const validate = require('../middleware/validate');

// Public routes
router.get('/random', messageController.getRandomMessage);
router.get('/:id', messageController.getMessage);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.get('/', messageController.getMessages);

router.post('/',
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('content').trim().notEmpty().withMessage('Content is required'),
        body('category').optional().isIn(['workout', 'nutrition', 'mindset', 'recovery', 'general']),
        body('triggerType').optional().isIn(['time', 'accomplishment', 'general']),
        body('targetAudience').optional().isIn(['beginner', 'intermediate', 'advanced', 'all'])
    ],
    validate,
    messageController.createMessage
);

router.put('/:id',
    [
        body('title').optional().trim().notEmpty(),
        body('content').optional().trim().notEmpty(),
        body('category').optional().isIn(['workout', 'nutrition', 'mindset', 'recovery', 'general']),
        body('triggerType').optional().isIn(['time', 'accomplishment', 'general']),
        body('targetAudience').optional().isIn(['beginner', 'intermediate', 'advanced', 'all'])
    ],
    validate,
    messageController.updateMessage
);

router.patch('/:id/toggle', messageController.toggleMessageStatus);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
