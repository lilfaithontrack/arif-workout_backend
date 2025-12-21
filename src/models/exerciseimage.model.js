const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExerciseImage = sequelize.define('ExerciseImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    exerciseSlug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Slug of the exercise folder this media belongs to'
    },
    subfolder: {
        type: DataTypes.ENUM('main', 'variations', 'form-guide', 'muscles', 'equipment', 'progression', 'common-mistakes'),
        allowNull: false,
        comment: 'Subfolder category for the media'
    },
    mediaType: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false,
        defaultValue: 'image',
        comment: 'Type of media file (image or video)'
    },
    filename: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Auto-generated filename'
    },
    originalName: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Original filename from upload'
    },
    path: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        comment: 'Filesystem path to the media file'
    },
    url: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        comment: 'Public URL to access the media file'
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'File size in bytes'
    },
    mimeType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'MIME type of the media file'
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in seconds (for videos only)'
    },
    thumbnailUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        comment: 'Thumbnail URL for video files'
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: 'User ID who uploaded this media'
    },
    exerciseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'exercises',
            key: 'id'
        },
        comment: 'Optional reference to exercise record'
    }
}, {
    tableName: 'exercise_images',
    timestamps: true,
    indexes: [
        { fields: ['exerciseSlug', 'subfolder'] },
        { fields: ['exerciseSlug', 'mediaType'] },
        { fields: ['uploadedBy'] },
        { fields: ['exerciseId'] }
    ]
});

module.exports = ExerciseImage;
