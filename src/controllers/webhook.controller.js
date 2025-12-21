const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentService = require('../services/payment.service');
const Order = require('../models/order.model');
const Subscription = require('../models/subscription.model');
const Course = require('../models/course.model');

// Stripe webhook handler
exports.stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    const payment = await paymentService.handleStripeWebhook(event);

    if (payment && payment.status === 'succeeded') {
      // Update related order or subscription
      const order = await Order.findOne({ paymentId: payment._id });
      if (order) {
        order.status = 'paid';
        await order.save();

        // Increment course enrollment count
        await Course.findByIdAndUpdate(order.courseId, {
          $inc: { enrollmentCount: 1 }
        });
      }

      const subscription = await Subscription.findOne({ lastPaymentId: payment._id });
      if (subscription) {
        subscription.status = 'active';
        subscription.paymentHistory.push({
          paymentId: payment._id,
          date: new Date(),
          amount: payment.amount,
          status: 'succeeded'
        });
        await subscription.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Telebirr webhook handler
exports.telebirrWebhook = async (req, res, next) => {
  try {
    const data = req.body;

    // Verify Telebirr signature (implement based on Telebirr docs)
    // ...

    const payment = await paymentService.handleTelebirrWebhook(data);

    if (payment && payment.status === 'succeeded') {
      // Update related order or subscription
      const order = await Order.findOne({ paymentId: payment._id });
      if (order) {
        order.status = 'paid';
        await order.save();

        await Course.findByIdAndUpdate(order.courseId, {
          $inc: { enrollmentCount: 1 }
        });
      }

      const subscription = await Subscription.findOne({ lastPaymentId: payment._id });
      if (subscription) {
        subscription.status = 'active';
        subscription.paymentHistory.push({
          paymentId: payment._id,
          date: new Date(),
          amount: payment.amount,
          status: 'succeeded'
        });
        await subscription.save();
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Telebirr webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Apple Pay webhook handler
exports.applePayWebhook = async (req, res, next) => {
  try {
    // Implement Apple Pay webhook handling
    res.json({ success: true });
  } catch (error) {
    console.error('Apple Pay webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
