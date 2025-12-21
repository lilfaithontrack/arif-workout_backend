const { UserSurvey, AIWorkoutPlan, User } = require('../models');
const AIWorkoutGenerator = require('../services/ai-workout-generator.service');

/**
 * AI Workout Plan Controller
 * Handles survey submission and AI plan generation
 */

// Submit user survey
exports.submitSurvey = async (req, res) => {
  try {
    const userId = req.user.id;
    const surveyData = req.body;

    // Deactivate previous surveys
    await UserSurvey.update(
      { isActive: false },
      { where: { userId, isActive: true } }
    );

    // Create new survey
    const survey = await UserSurvey.create({
      ...surveyData,
      userId,
      completedAt: new Date(),
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Survey submitted successfully',
      data: survey
    });
  } catch (error) {
    console.error('Submit survey error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit survey',
      error: error.message
    });
  }
};

// Generate AI workout plan
exports.generatePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { surveyId } = req.body;

    // Get survey
    const survey = await UserSurvey.findOne({
      where: { id: surveyId, userId }
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    console.log(`🤖 Generating AI workout plan for user ${userId}...`);

    // Generate plan using AI
    const planData = await AIWorkoutGenerator.generatePlan(survey, userId);

    // Deactivate previous plans
    await AIWorkoutPlan.update(
      { isActive: false },
      { where: { userId, isActive: true } }
    );

    // Create new plan
    const plan = await AIWorkoutPlan.create({
      ...planData,
      userId,
      surveyId,
      isActive: true
    });

    // Update survey
    await survey.update({
      lastPlanGenerated: new Date(),
      aiScore: planData.confidenceScore
    });

    res.status(201).json({
      success: true,
      message: 'AI workout plan generated successfully',
      data: plan
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate workout plan',
      error: error.message
    });
  }
};

// Get user's active plan
exports.getActivePlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const plan = await AIWorkoutPlan.findOne({
      where: { userId, isActive: true },
      include: [
        {
          model: UserSurvey,
          as: 'survey'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'No active plan found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Get active plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active plan',
      error: error.message
    });
  }
};

// Get all user plans
exports.getUserPlans = async (req, res) => {
  try {
    const userId = req.user.id;

    const plans = await AIWorkoutPlan.findAll({
      where: { userId },
      include: [
        {
          model: UserSurvey,
          as: 'survey'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error('Get user plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans',
      error: error.message
    });
  }
};

// Get plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const plan = await AIWorkoutPlan.findOne({
      where: { id, userId },
      include: [
        {
          model: UserSurvey,
          as: 'survey'
        }
      ]
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plan',
      error: error.message
    });
  }
};

// Update plan status
exports.updatePlanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    const plan = await AIWorkoutPlan.findOne({
      where: { id, userId }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    await plan.update({ status });

    res.json({
      success: true,
      message: 'Plan status updated',
      data: plan
    });
  } catch (error) {
    console.error('Update plan status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update plan status',
      error: error.message
    });
  }
};

// Update plan progress
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { currentWeek, completionRate } = req.body;

    const plan = await AIWorkoutPlan.findOne({
      where: { id, userId }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    await plan.update({
      currentWeek: currentWeek || plan.currentWeek,
      completionRate: completionRate || plan.completionRate
    });

    res.json({
      success: true,
      message: 'Progress updated',
      data: plan
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

// Rate plan
exports.ratePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, feedback } = req.body;

    const plan = await AIWorkoutPlan.findOne({
      where: { id, userId }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    await plan.update({
      userRating: rating,
      userFeedback: feedback
    });

    res.json({
      success: true,
      message: 'Rating submitted',
      data: plan
    });
  } catch (error) {
    console.error('Rate plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate plan',
      error: error.message
    });
  }
};

// Get user's active survey
exports.getActiveSurvey = async (req, res) => {
  try {
    const userId = req.user.id;

    const survey = await UserSurvey.findOne({
      where: { userId, isActive: true },
      order: [['createdAt', 'DESC']]
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'No active survey found'
      });
    }

    res.json({
      success: true,
      data: survey
    });
  } catch (error) {
    console.error('Get active survey error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get survey',
      error: error.message
    });
  }
};

// ADMIN: Get all plans
exports.getAllPlans = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (userId) whereClause.userId = userId;

    const { count, rows: plans } = await AIWorkoutPlan.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: UserSurvey,
          as: 'survey'
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: plans
    });
  } catch (error) {
    console.error('Get all plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans',
      error: error.message
    });
  }
};

// ADMIN: Review plan
exports.reviewPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, reviewNotes } = req.body;
    const reviewerId = req.user.id;

    const plan = await AIWorkoutPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    await plan.update({
      isApproved,
      reviewNotes,
      reviewedBy: reviewerId
    });

    res.json({
      success: true,
      message: 'Plan reviewed successfully',
      data: plan
    });
  } catch (error) {
    console.error('Review plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review plan',
      error: error.message
    });
  }
};

// ADMIN: Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalPlans = await AIWorkoutPlan.count();
    const activePlans = await AIWorkoutPlan.count({ where: { status: 'active' } });
    const completedPlans = await AIWorkoutPlan.count({ where: { status: 'completed' } });
    const totalSurveys = await UserSurvey.count();

    // Average confidence score
    const plans = await AIWorkoutPlan.findAll({
      attributes: ['confidenceScore']
    });
    const avgConfidence = plans.reduce((sum, p) => sum + p.confidenceScore, 0) / plans.length;

    // Average completion rate
    const avgCompletion = plans.reduce((sum, p) => sum + p.completionRate, 0) / plans.length;

    res.json({
      success: true,
      data: {
        totalPlans,
        activePlans,
        completedPlans,
        totalSurveys,
        avgConfidence: Math.round(avgConfidence),
        avgCompletion: Math.round(avgCompletion)
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message
    });
  }
};
