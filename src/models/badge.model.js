const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Badge = sequelize.define('Badge', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Badge name'
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'URL-friendly identifier'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Badge description'
    },
    icon: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Emoji or icon identifier'
    },
    category: {
        type: DataTypes.ENUM('workout', 'streak', 'milestone', 'cardio', 'strength', 'endurance', 'special'),
        defaultValue: 'milestone',
        comment: 'Badge category type'
    },
    requirement: {
        type: DataTypes.JSON,
        defaultValue: {},
        comment: 'Achievement requirement: { type, value, target }'
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        comment: 'Points awarded when unlocked'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether badge is currently active'
    },
    displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Display order'
    },
    imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Optional badge image URL'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: 'Admin who created this badge'
    }
}, {
    tableName: 'badges',
    timestamps: true,
    indexes: [
        { fields: ['slug'], unique: true },
        { fields: ['category'] },
        { fields: ['isActive'] },
        { fields: ['displayOrder'] }
    ]
});

module.exports = Badge;
