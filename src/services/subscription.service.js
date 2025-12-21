const Subscription = require('../models/subscription.model');
const Package = require('../models/package.model');
const Payment = require('../models/payment.model');
const paymentService = require('./payment.service');

class SubscriptionService {
  /**
   * Calculate next billing date based on billing cycle
   */
  calculateNextBillingDate(startDate, billingCycle) {
    const date = new Date(startDate);
    
    switch (billingCycle) {
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    
    return date;
  }

  /**
   * Create new subscription
   */
  async createSubscription({ userId, packageId, paymentProvider, paymentMethod }) {
    const pkg = await Package.findById(packageId);
    
    if (!pkg) {
      throw new Error('Package not found');
    }

    if (pkg.status !== 'active') {
      throw new Error('Package is not active');
    }

    // Check for existing active subscription
    const existingSubscription = await Subscription.findOne({
      userId,
      packageId,
      status: 'active'
    });

    if (existingSubscription) {
      throw new Error('User already has an active subscription to this package');
    }

    const startDate = new Date();
    const trialEndDate = pkg.trialDays > 0 
      ? new Date(Date.now() + pkg.trialDays * 24 * 60 * 60 * 1000)
      : null;
    
    const nextBillingDate = trialEndDate || this.calculateNextBillingDate(startDate, pkg.billingCycle);

    // Create initial payment if no trial
    let payment = null;
    if (!trialEndDate) {
      const paymentResult = await paymentService.createStripePayment({
        userId,
        amount: pkg.price,
        currency: pkg.currency,
        metadata: {
          packageId: packageId.toString(),
          type: 'subscription',
          billingCycle: pkg.billingCycle
        }
      });
      payment = paymentResult.payment;
    }

    const subscription = new Subscription({
      userId,
      packageId,
      paymentMethod: payment?._id,
      status: 'active',
      startDate,
      trialEndDate,
      nextBillingDate,
      billingCycle: pkg.billingCycle,
      amount: pkg.price,
      currency: pkg.currency,
      lastPaymentId: payment?._id
    });

    await subscription.save();

    // Update package subscriber count
    pkg.subscriberCount += 1;
    await pkg.save();

    return {
      subscription,
      payment,
      clientSecret: payment?.metadata?.clientSecret
    };
  }

  /**
   * Process subscription renewal
   */
  async processRenewal(subscriptionId) {
    const subscription = await Subscription.findById(subscriptionId)
      .populate('packageId');

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.status !== 'active') {
      throw new Error('Subscription is not active');
    }

    try {
      // Create payment for renewal
      const paymentResult = await paymentService.createStripePayment({
        userId: subscription.userId,
        amount: subscription.amount,
        currency: subscription.currency,
        metadata: {
          subscriptionId: subscriptionId.toString(),
          packageId: subscription.packageId._id.toString(),
          type: 'subscription_renewal',
          billingCycle: subscription.billingCycle
        }
      });

      // Update subscription
      subscription.lastPaymentId = paymentResult.payment._id;
      subscription.nextBillingDate = this.calculateNextBillingDate(
        subscription.nextBillingDate,
        subscription.billingCycle
      );
      
      subscription.paymentHistory.push({
        paymentId: paymentResult.payment._id,
        date: new Date(),
        amount: subscription.amount,
        status: 'initiated'
      });

      await subscription.save();

      return {
        subscription,
        payment: paymentResult.payment,
        clientSecret: paymentResult.clientSecret
      };
    } catch (error) {
      // Mark subscription as past_due if payment fails
      subscription.status = 'past_due';
      await subscription.save();
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId, reason) {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;

    await subscription.save();

    // Update package subscriber count
    const pkg = await Package.findById(subscription.packageId);
    if (pkg) {
      pkg.subscriberCount = Math.max(0, pkg.subscriberCount - 1);
      await pkg.save();
    }

    return subscription;
  }

  /**
   * Pause subscription
   */
  async pauseSubscription(subscriptionId, reason) {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.status !== 'active') {
      throw new Error('Can only pause active subscriptions');
    }

    subscription.status = 'paused';
    subscription.pausedAt = new Date();
    subscription.pauseReason = reason;

    await subscription.save();
    return subscription;
  }

  /**
   * Resume subscription
   */
  async resumeSubscription(subscriptionId) {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.status !== 'paused') {
      throw new Error('Can only resume paused subscriptions');
    }

    subscription.status = 'active';
    subscription.pausedAt = null;
    subscription.pauseReason = null;

    await subscription.save();
    return subscription;
  }

  /**
   * Get subscriptions due for renewal
   */
  async getSubscriptionsDueForRenewal() {
    const now = new Date();
    
    return await Subscription.find({
      status: 'active',
      nextBillingDate: { $lte: now }
    }).populate('packageId userId');
  }

  /**
   * Get user subscriptions
   */
  async getUserSubscriptions(userId, status = null) {
    const query = { userId };
    if (status) query.status = status;

    return await Subscription.find(query)
      .populate('packageId')
      .sort({ createdAt: -1 });
  }
}

module.exports = new SubscriptionService();
