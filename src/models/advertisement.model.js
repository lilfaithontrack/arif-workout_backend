const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Advertisement Model
 * Stores professional advertisements for the platform
 */
const Advertisement = sequelize.define('Advertisement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Advertisement title'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Advertisement description/content'
  },
  type: {
    type: DataTypes.ENUM('banner', 'popup', 'sidebar', 'inline', 'video', 'native'),
    allowNull: false,
    defaultValue: 'banner',
    comment: 'Type of advertisement'
  },
  category: {
    type: DataTypes.ENUM('fitness', 'nutrition', 'equipment', 'supplements', 'apparel', 'general'),
    allowNull: false,
    defaultValue: 'general',
    comment: 'Advertisement category'
  },

  // Media
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Main advertisement image URL'
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Thumbnail image URL'
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Video advertisement URL'
  },

  // Link & CTA
  targetUrl: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    comment: 'URL where ad clicks should redirect'
  },
  ctaText: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Learn More',
    comment: 'Call-to-action button text'
  },

  // Placement & Display
  placement: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of page placements: ["home", "workout", "nutrition", "profile"]'
  },
  position: {
    type: DataTypes.ENUM('top', 'bottom', 'left', 'right', 'center', 'floating'),
    allowNull: true,
    defaultValue: 'top',
    comment: 'Position on the page'
  },
  dimensions: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Width and height: {width: 728, height: 90}'
  },

  // Scheduling
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'When ad should start showing'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When ad should stop showing (null = indefinite)'
  },

  // Targeting
  targetAudience: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Targeting criteria: {gender, ageRange, fitnessLevel, goals}'
  },
  targetDevices: {
    type: DataTypes.JSON,
    defaultValue: ['desktop', 'mobile', 'tablet'],
    comment: 'Device types to show ad on'
  },

  // Priority & Budget
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'Display priority (1-10, higher = more priority)'
  },
  dailyBudget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Daily budget in currency'
  },
  totalBudget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Total campaign budget'
  },
  costPerClick: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Cost per click (CPC)'
  },
  costPerImpression: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    comment: 'Cost per 1000 impressions (CPM)'
  },

  // Analytics
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total number of times ad was displayed'
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total number of clicks'
  },
  conversions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total number of conversions/actions'
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Total amount spent on this ad'
  },

  // Advertiser Information
  advertiserName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Name of the advertiser/company'
  },
  advertiserEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Contact email for advertiser'
  },
  advertiserPhone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Contact phone for advertiser'
  },
  advertiserWebsite: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Advertiser website'
  },

  // Status & Moderation
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'active', 'paused', 'completed', 'rejected'),
    allowNull: false,
    defaultValue: 'draft',
    comment: 'Advertisement status'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether ad is currently active'
  },
  moderationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notes from moderation/review'
  },

  // Management
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Admin user who created this ad'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Admin user who approved this ad'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When ad was approved'
  },

  // Additional Settings
  maxImpressions: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum impressions allowed (null = unlimited)'
  },
  maxClicks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum clicks allowed (null = unlimited)'
  },
  frequency: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Frequency capping: {perUser: 3, perDay: 10}'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Tags for organizing ads'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes about this ad'
  }
}, {
  tableName: 'advertisements',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['isActive'] },
    { fields: ['type'] },
    { fields: ['category'] },
    { fields: ['startDate'] },
    { fields: ['endDate'] },
    { fields: ['priority'] },
    { fields: ['createdBy'] },
    { fields: ['approvedBy'] },
    { fields: ['advertiserName'] }
  ],
  hooks: {
    beforeSave: (ad) => {
      // Auto-set isActive based on status and dates
      const now = new Date();
      if (ad.status === 'active' &&
        ad.startDate <= now &&
        (!ad.endDate || ad.endDate >= now)) {
        ad.isActive = true;
      } else {
        ad.isActive = false;
      }
    }
  }
});

module.exports = Advertisement;
