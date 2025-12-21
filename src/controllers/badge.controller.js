const Badge = require('../models/badge.model');

// Get all badges (public endpoint)
exports.getAllBadges = async (req, res, next) => {
    try {
        const badges = await Badge.findAll({
            where: { isActive: true },
            order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
            attributes: { exclude: ['createdBy'] }
        });

        res.status(200).json({ success: true, badges });
    } catch (error) {
        next(error);
    }
};

// Get all badges (admin endpoint with full details)
exports.getBadgesAdmin = async (req, res, next) => {
    try {
        const badges = await Badge.findAll({
            order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, badges });
    } catch (error) {
        next(error);
    }
};

// Create a new badge
exports.createBadge = async (req, res, next) => {
    try {
        const { name, description, icon, category, requirement, points, imageUrl, displayOrder } = req.body;

        // Create slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const badge = await Badge.create({
            name,
            slug,
            description,
            icon,
            category: category || 'milestone',
            requirement: requirement || {},
            points: points || 10,
            imageUrl,
            displayOrder: displayOrder || 0,
            createdBy: req.user.id,
            isActive: true
        });

        res.status(201).json({ success: true, badge });
    } catch (error) {
        next(error);
    }
};

// Update a badge
exports.updateBadge = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, icon, category, requirement, points, imageUrl, displayOrder, isActive } = req.body;

        const badge = await Badge.findByPk(id);

        if (!badge) {
            return res.status(404).json({ success: false, message: 'Badge not found' });
        }

        // Update slug if name changed
        let slug = badge.slug;
        if (name && name !== badge.name) {
            slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        await badge.update({
            name: name || badge.name,
            slug,
            description: description || badge.description,
            icon: icon || badge.icon,
            category: category || badge.category,
            requirement: requirement !== undefined ? requirement : badge.requirement,
            points: points !== undefined ? points : badge.points,
            imageUrl: imageUrl !== undefined ? imageUrl : badge.imageUrl,
            displayOrder: displayOrder !== undefined ? displayOrder : badge.displayOrder,
            isActive: isActive !== undefined ? isActive : badge.isActive
        });

        res.status(200).json({ success: true, badge });
    } catch (error) {
        next(error);
    }
};

// Delete a badge
exports.deleteBadge = async (req, res, next) => {
    try {
        const { id } = req.params;

        const badge = await Badge.findByPk(id);

        if (!badge) {
            return res.status(404).json({ success: false, message: 'Badge not found' });
        }

        await badge.destroy();

        res.status(200).json({ success: true, message: 'Badge deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get badge by ID
exports.getBadgeById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const badge = await Badge.findByPk(id);

        if (!badge) {
            return res.status(404).json({ success: false, message: 'Badge not found' });
        }

        res.status(200).json({ success: true, badge });
    } catch (error) {
        next(error);
    }
};
