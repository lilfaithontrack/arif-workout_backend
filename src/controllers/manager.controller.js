const User = require('../models/user.model');
const Order = require('../models/order.model');
const Subscription = require('../models/subscription.model');
const Payment = require('../models/payment.model');

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 100 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.roles = role;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-__v').sort({ createdAt: -1 }).limit(parseInt(limit)).skip(skip),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// Get user details
exports.getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-__v');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Get all orders
exports.getOrders = async (req, res, next) => {
  try {
    const { status, userId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email')
        .populate('courseId', 'title price')
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

// Get order details
exports.getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('userId', 'name email phone')
      .populate('courseId')
      .populate('paymentId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, notes, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order updated', order });
  } catch (error) {
    next(error);
  }
};

// Get all subscriptions
exports.getSubscriptions = async (req, res, next) => {
  try {
    const { status, userId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;
    const [subscriptions, total] = await Promise.all([
      Subscription.find(query)
        .populate('userId', 'name email')
        .populate('packageId', 'title price billingCycle')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Subscription.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      subscriptions,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// Get subscription details
exports.getSubscriptionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id)
      .populate('userId', 'name email phone')
      .populate('packageId')
      .populate('paymentMethod')
      .populate('lastPaymentId');

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    next(error);
  }
};

// Get all payments
exports.getPayments = async (req, res, next) => {
  try {
    const { status, provider, userId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (provider) query.provider = provider;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Payment.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      payments,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalSubscriptions,
      recentOrders,
      recentSubscriptions
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments({ status: 'paid' }),
      Subscription.countDocuments({ status: 'active' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').populate('courseId', 'title'),
      Subscription.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').populate('packageId', 'title')
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalSubscriptions,
        recentOrders,
        recentSubscriptions
      }
    });
  } catch (error) {
    next(error);
  }
};
