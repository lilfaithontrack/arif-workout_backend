const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NutritionImage = sequelize.define('NutritionImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nutritionSlug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Slug identifier for the nutrition item (e.g., chicken-breast, brown-rice)'
    },
    subfolder: {
        type: DataTypes.ENUM(
            'main',
            'portions',
            'prepared',
            'nutrition-label',
            'meal-prep',
            'recipes',
            'alternatives'
        ),
        allowNull: false,
        comment: 'Subfolder category for organization'
    },
    mediaType: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false,
        defaultValue: 'image',
        comment: 'Type of media file'
    },
    filename: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Generated filename with timestamp'
    },
    originalName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Original filename from upload'
    },
    path: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Full file path on server'
    },
    url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Public URL to access the file'
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'File size in bytes'
    },
    mimeType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'MIME type of the file'
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: 'User who uploaded the file'
    },
    nutritionItemId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'nutrition_items',
            key: 'id'
        },
        comment: 'Foreign key to nutrition_items table (optional, nutritionSlug is also available)'
    },
    isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this is the primary/main image for the nutrition item'
    }
}, {
    tableName: 'nutrition_images',
    timestamps: true,
    indexes: [
        { fields: ['nutritionSlug'] },
        { fields: ['nutritionItemId'] },
        { fields: ['subfolder'] },
        { fields: ['mediaType'] },
        { fields: ['isPrimary'] },
        { fields: ['uploadedBy'] }
    ]
});

module.exports = NutritionImage;
