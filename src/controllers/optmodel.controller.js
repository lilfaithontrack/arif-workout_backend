const { Phase, WorkoutSection, Assessment, AssessmentResult, Program, User } = require('../models');
const { Op } = require('sequelize');

// Helper to generate slug
const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// ==========================================
// PHASES CRUD
// ==========================================

exports.getPhases = async (req, res) => {
  try {
    const phases = await Phase.findAll({ order: [['phaseNumber', 'ASC']] });
    res.json({ success: true, phases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPhase = async (req, res) => {
  try {
    const phase = await Phase.findByPk(req.params.id);
    if (!phase) return res.status(404).json({ success: false, message: 'Phase not found' });
    res.json({ success: true, phase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPhase = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) data.slug = generateSlug(data.name);

    const phase = await Phase.create(data);
    res.status(201).json({ success: true, phase, message: 'Phase created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePhase = async (req, res) => {
  try {
    const phase = await Phase.findByPk(req.params.id);
    if (!phase) return res.status(404).json({ success: false, message: 'Phase not found' });

    const updateData = { ...req.body };
    if (updateData.name && !updateData.slug) updateData.slug = generateSlug(updateData.name);

    await phase.update(updateData);
    res.json({ success: true, phase, message: 'Phase updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePhase = async (req, res) => {
  try {
    const phase = await Phase.findByPk(req.params.id);
    if (!phase) return res.status(404).json({ success: false, message: 'Phase not found' });

    // Soft delete
    await phase.update({ isActive: false });
    res.json({ success: true, message: 'Phase deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// WORKOUT SECTIONS CRUD
// ==========================================

exports.getWorkoutSections = async (req, res) => {
  try {
    const sections = await WorkoutSection.findAll({
      where: { isActive: true },
      order: [['ordinal', 'ASC']]
    });
    res.json({ success: true, sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkoutSection = async (req, res) => {
  try {
    const section = await WorkoutSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    res.json({ success: true, section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createWorkoutSection = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) data.slug = generateSlug(data.name);

    const section = await WorkoutSection.create(data);
    res.status(201).json({ success: true, section, message: 'Section created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWorkoutSection = async (req, res) => {
  try {
    const section = await WorkoutSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    const updateData = { ...req.body };
    if (updateData.name && !updateData.slug) updateData.slug = generateSlug(updateData.name);

    await section.update(updateData);
    res.json({ success: true, section, message: 'Section updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteWorkoutSection = async (req, res) => {
  try {
    const section = await WorkoutSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    await section.update({ isActive: false });
    res.json({ success: true, message: 'Section deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ASSESSMENTS CRUD
// ==========================================

exports.getAssessments = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const assessments = await Assessment.findAll({ where, order: [['category', 'ASC'], ['name', 'ASC']] });
    res.json({ success: true, assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAssessment = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) data.slug = generateSlug(data.name);

    const assessment = await Assessment.create(data);
    res.status(201).json({ success: true, assessment, message: 'Assessment created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    const updateData = { ...req.body };
    if (updateData.name && !updateData.slug) updateData.slug = generateSlug(updateData.name);

    await assessment.update(updateData);
    res.json({ success: true, assessment, message: 'Assessment updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    await assessment.update({ isActive: false });
    res.json({ success: true, message: 'Assessment deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ASSESSMENT RESULTS CRUD
// ==========================================

exports.getAssessmentResults = async (req, res) => {
  try {
    const { assessmentId, userId, search, page = 1, limit = 50 } = req.query;
    const where = {};
    if (assessmentId) where.assessmentId = assessmentId;
    if (userId) where.userId = userId;

    const offset = (page - 1) * limit;

    const { count, rows: results } = await AssessmentResult.findAndCountAll({
      where,
      include: [
        { model: Assessment, as: 'assessment', attributes: ['id', 'name', 'category'], required: false },
        { model: User, as: 'subject', attributes: ['id', 'name', 'email'], required: false },
        { model: User, as: 'practitioner', attributes: ['id', 'name'], required: false },
        { model: Program, as: 'linkedProgram', attributes: ['id', 'name'], required: false }
      ],
      order: [['assessedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      results,
      pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAssessmentResult = async (req, res) => {
  try {
    const result = await AssessmentResult.findByPk(req.params.id, {
      include: [
        { model: Assessment, as: 'assessment', required: false },
        { model: User, as: 'subject', attributes: ['id', 'name', 'email'], required: false },
        { model: User, as: 'practitioner', attributes: ['id', 'name'], required: false }
      ]
    });
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAssessmentResult = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.assessedAt) data.assessedAt = new Date();
    if (req.user) data.assessedBy = data.assessedBy || req.user.id;

    const result = await AssessmentResult.create(data);
    res.status(201).json({ success: true, result, message: 'Assessment result created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAssessmentResult = async (req, res) => {
  try {
    const result = await AssessmentResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });

    await result.update(req.body);
    res.json({ success: true, result, message: 'Assessment result updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAssessmentResult = async (req, res) => {
  try {
    const result = await AssessmentResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });

    await result.destroy();
    res.json({ success: true, message: 'Assessment result deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
