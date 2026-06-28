const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    comment: 'Category like Stabilization Endurance, Muscle Gain, etc.'
  },
  categoryName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Denormalized category name for quick display'
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'all_levels'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  goal: {
    type: DataTypes.ENUM('weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'strength', 'stabilization'),
    allowNull: true
  },
  durationWeeks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Total program duration in weeks'
  },
  workoutsCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Number of workouts in the program'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  bannerImageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Hero/banner image for program card'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Featured on homepage'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of tags like ["bodyweight", "no-equipment", "home"]'
  },
  equipment: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Required equipment'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Display order in lists'
  },
  // NASM OPT Model fields
  optPhaseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'phases',
      key: 'id'
    },
    comment: 'FK to phases — the OPT phase this program belongs to'
  },
  optPhase: {
    type: DataTypes.ENUM('stabilization_endurance', 'strength_endurance', 'muscular_development', 'maximal_strength', 'power'),
    allowNull: true,
    comment: 'NASM OPT Model primary phase (denormalized for quick access)'
  },
  optPhaseNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Phase number in NASM OPT Model (1-5)'
  },
  assessmentRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether program includes assessments'
  },
  hasAssessments: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Program contains assessment workouts'
  },
  progressionType: {
    type: DataTypes.ENUM('linear', 'undulating', 'block', 'conjugate'),
    allowNull: true,
    defaultValue: 'linear',
    comment: 'How the program progresses'
  }
}, {
  tableName: 'programs',
  timestamps: true,
  indexes: [
    { fields: ['categoryId'] },
    { fields: ['level'] },
    { fields: ['goal'] },
    { fields: ['isActive'] },
    { fields: ['isFeatured'] },
    { fields: ['createdBy'] },
    { fields: ['orderIndex'] },
    { fields: ['optPhaseId'] }
  ]
});

module.exports = Program;
