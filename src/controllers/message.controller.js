const MotivationalMessage = require('../models/motivationalmessage.model');
const { Op } = require('sequelize');

// Get all messages (with filters) - Admin
exports.getMessages = async (req, res, next) => {
    try {
        const { category, triggerType, targetAudience, isActive, page = 1, limit = 50 } = req.query;

        const where = {};
        if (category) where.category = category;
        if (triggerType) where.triggerType = triggerType;
        if (targetAudience) where.targetAudience = targetAudience;
        if (isActive !== undefined) where.isActive = isActive === 'true';

        const offset = (page - 1) * limit;

        const { count, rows: messages } = await MotivationalMessage.findAndCountAll({
            where,
            order: [['priority', 'DESC'], ['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        res.status(200).json({
            success: true,
            count: messages.length,
            total: count,
            data: messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get random message (for display to users)
exports.getRandomMessage = async (req, res, next) => {
    try {
        const { triggerType, triggerValue, category, targetAudience = 'all' } = req.query;

        const where = { isActive: true };
        if (category) where.category = category;
        if (triggerType) where.triggerType = triggerType;
        if (triggerValue) where.triggerValue = triggerValue;

        // Include messages for "all" audiences plus specific audience
        where.targetAudience = { [Op.in]: ['all', targetAudience] };

        const messages = await MotivationalMessage.findAll({
            where,
            order: [['priority', 'DESC']]
        });

        if (messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No messages found matching criteria'
            });
        }

        // Weighted random selection based on priority
        const totalPriority = messages.reduce((sum, msg) => sum + msg.priority, 0);
        let random = Math.random() * totalPriority;

        let selectedMessage = messages[0];
        for (const msg of messages) {
            random -= msg.priority;
            if (random <= 0) {
                selectedMessage = msg;
                break;
            }
        }

        // Increment view count
        await selectedMessage.increment('viewCount');

        res.status(200).json({
            success: true,
            data: selectedMessage
        });
    } catch (error) {
        next(error);
    }
};

// Get single message
exports.getMessage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const message = await MotivationalMessage.findByPk(id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// Create message - Admin
exports.createMessage = async (req, res, next) => {
    try {
        const { title, content, category, triggerType, triggerValue, targetAudience, priority } = req.body;

        const message = await MotivationalMessage.create({
            title,
            content,
            category,
            triggerType,
            triggerValue,
            targetAudience,
            priority: priority || 1,
            createdBy: req.userId
        });

        res.status(201).json({
            success: true,
            message: 'Motivational message created successfully',
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// Update message - Admin
exports.updateMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, category, triggerType, triggerValue, targetAudience, priority, isActive } = req.body;

        const message = await MotivationalMessage.findByPk(id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        await message.update({
            title: title !== undefined ? title : message.title,
            content: content !== undefined ? content : message.content,
            category: category !== undefined ? category : message.category,
            triggerType: triggerType !== undefined ? triggerType : message.triggerType,
            triggerValue: triggerValue !== undefined ? triggerValue : message.triggerValue,
            targetAudience: targetAudience !== undefined ? targetAudience : message.targetAudience,
            priority: priority !== undefined ? priority : message.priority,
            isActive: isActive !== undefined ? isActive : message.isActive
        });

        res.status(200).json({
            success: true,
            message: 'Message updated successfully',
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// Toggle message status - Admin
exports.toggleMessageStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const message = await MotivationalMessage.findByPk(id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        await message.update({ isActive: !message.isActive });

        res.status(200).json({
            success: true,
            message: `Message ${message.isActive ? 'activated' : 'deactivated'} successfully`,
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// Delete message - Admin
exports.deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const message = await MotivationalMessage.findByPk(id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        await message.destroy();

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully',
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};
