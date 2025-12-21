const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MotivationalMessage = sequelize.define('MotivationalMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Message title or headline'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Message content/body'
    },
    category: {
        type: DataTypes.ENUM('workout', 'nutrition', 'mindset', 'recovery', 'general'),
        defaultValue: 'general',
        comment: 'Message category'
    },
    triggerType: {
        type: DataTypes.ENUM('time', 'accomplishment', 'general'),
        defaultValue: 'general',
        comment: 'When to show this message'
    },
    triggerValue: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'morning/afternoon/evening for time, workout-complete/streak-milestone for accomplishment'
    },
    targetAudience: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'all'),
        defaultValue: 'all',
        comment: 'Target audience level'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether message is active'
    },
    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'Display priority (higher = more likely to show)'
    },
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Number of times displayed'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: 'Admin user who created this message'
    }
}, {
    tableName: 'motivational_messages',
    timestamps: true,
    indexes: [
        { fields: ['category'] },
        { fields: ['triggerType'] },
        { fields: ['isActive'] },
        { fields: ['targetAudience'] },
        { fields: ['priority'] }
    ]
});

module.exports = MotivationalMessage;
