const Order = require('../models/order.model');
const Subscription = require('../models/subscription.model');
const Course = require('../models/course.model');
const paymentService = require('../services/payment.service');
const subscriptionService = require('../services/subscription.service');

// Create order for course purchase
exports.createOrder = async (req, res, next) => {
  try {
    const { courseId, paymentProvider = 'stripe' } = req.body;

    const course = await Course.findById(courseId);
    if (!course || course.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Course not found or not available' });
    }

    // Check if user already purchased
    const existingOrder = await Order.findOne({
      userId: req.userId,
      courseId,
      status: 'paid'
    });

    if (existingOrder) {
      return res.status(400).json({ success: false, message: 'You already own this course' });
    }

    // Create payment
    let paymentResult;
    if (paymentProvider === 'stripe') {
      paymentResult = await paymentService.createStripePayment({
        userId: req.userId,
        amount: course.price,
        currency: course.currency,
        metadata: { courseId: courseId.toString(), type: 'course_purchase' }
      });
    } else if (paymentProvider === 'telebirr') {
      paymentResult = await paymentService.createTelebirrPayment({
        userId: req.userId,
        amount: course.price,
        currency: course.currency,
        metadata: { courseId: courseId.toString(), type: 'course_purchase' }
      });
    }

    // Create order
    const order = new Order({
      userId: req.userId,
      courseId,
      amount: course.price,
      currency: course.currency,
      paymentId: paymentResult.payment._id,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created',
      order,
      clientSecret: paymentResult.clientSecret,
      paymentUrl: paymentResult.paymentUrl
    });
  } catch (error) {
    next(error);
  }
};

// Subscribe to package
exports.createSubscription = async (req, res, next) => {
  try {
    const { packageId, paymentProvider = 'stripe' } = req.body;

    const result = await subscriptionService.createSubscription({
      userId: req.userId,
      packageId,
      paymentProvider,
      paymentMethod: req.body.paymentMethod
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created',
      subscription: result.subscription,
      clientSecret: result.clientSecret
    });
  } catch (error) {
    next(error);
  }
};

// Get user orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { userId: req.userId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('courseId', 'title price currency')
        .populate('paymentId')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Order.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// Get user subscriptions
exports.getUserSubscriptions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const subscriptions = await subscriptionService.getUserSubscriptions(req.userId, status);

    res.status(200).json({ success: true, subscriptions });
  } catch (error) {
    next(error);
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const subscription = await Subscription.findOne({ _id: id, userId: req.userId });
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    const updated = await subscriptionService.cancelSubscription(id, reason);
    res.status(200).json({ success: true, message: 'Subscription cancelled', subscription: updated });
  } catch (error) {
    next(error);
  }
};

// Pause subscription
exports.pauseSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const subscription = await Subscription.findOne({ _id: id, userId: req.userId });
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    const updated = await subscriptionService.pauseSubscription(id, reason);
    res.status(200).json({ success: true, message: 'Subscription paused', subscription: updated });
  } catch (error) {
    next(error);
  }
};

// Resume subscription
exports.resumeSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findOne({ _id: id, userId: req.userId });
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    const updated = await subscriptionService.resumeSubscription(id);
    res.status(200).json({ success: true, message: 'Subscription resumed', subscription: updated });
  } catch (error) {
    next(error);
  }
};
