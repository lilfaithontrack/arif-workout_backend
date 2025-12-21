const Payment = require('../models/payment.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  /**
   * Create Stripe payment intent
   */
  async createStripePayment({ userId, amount, currency, metadata }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          userId: userId.toString(),
          ...metadata
        }
      });

      const payment = new Payment({
        userId,
        provider: 'stripe',
        providerPaymentId: paymentIntent.id,
        method: 'card',
        amount,
        currency,
        status: 'initiated',
        metadata: {
          clientSecret: paymentIntent.client_secret,
          ...metadata
        }
      });

      await payment.save();

      return {
        payment,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw new Error('Failed to create Stripe payment');
    }
  }

  /**
   * Handle Stripe webhook
   */
  async handleStripeWebhook(event) {
    const paymentIntent = event.data.object;

    const payment = await Payment.findOne({
      providerPaymentId: paymentIntent.id
    });

    if (!payment) {
      console.error('Payment not found:', paymentIntent.id);
      return;
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        payment.status = 'succeeded';
        break;
      case 'payment_intent.payment_failed':
        payment.status = 'failed';
        payment.failureReason = paymentIntent.last_payment_error?.message;
        break;
      case 'payment_intent.canceled':
        payment.status = 'cancelled';
        break;
    }

    await payment.save();
    return payment;
  }

  /**
   * Create Telebirr payment
   */
  async createTelebirrPayment({ userId, amount, currency, metadata }) {
    // Telebirr integration placeholder
    // You'll need to implement actual Telebirr API calls
    
    const payment = new Payment({
      userId,
      provider: 'telebirr',
      providerPaymentId: `telebirr_${Date.now()}_${userId}`,
      method: 'mobile_money',
      amount,
      currency,
      status: 'initiated',
      metadata
    });

    await payment.save();

    return {
      payment,
      paymentUrl: `https://telebirr.com/pay/${payment.providerPaymentId}`,
      message: 'Telebirr payment initiated. Complete payment on your phone.'
    };
  }

  /**
   * Handle Telebirr webhook
   */
  async handleTelebirrWebhook(data) {
    const payment = await Payment.findOne({
      providerPaymentId: data.transactionId
    });

    if (!payment) {
      console.error('Payment not found:', data.transactionId);
      return;
    }

    if (data.status === 'SUCCESS') {
      payment.status = 'succeeded';
    } else if (data.status === 'FAILED') {
      payment.status = 'failed';
      payment.failureReason = data.reason;
    }

    await payment.save();
    return payment;
  }

  /**
   * Create Apple Pay payment
   */
  async createApplePayPayment({ userId, amount, currency, metadata }) {
    // Apple Pay integration placeholder
    
    const payment = new Payment({
      userId,
      provider: 'apple_pay',
      providerPaymentId: `apple_${Date.now()}_${userId}`,
      method: 'apple_pay',
      amount,
      currency,
      status: 'initiated',
      metadata
    });

    await payment.save();

    return {
      payment,
      message: 'Apple Pay payment initiated'
    };
  }

  /**
   * Process refund
   */
  async processRefund(paymentId, amount, reason) {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'succeeded') {
      throw new Error('Can only refund succeeded payments');
    }

    try {
      if (payment.provider === 'stripe') {
        await stripe.refunds.create({
          payment_intent: payment.providerPaymentId,
          amount: amount ? Math.round(amount * 100) : undefined
        });
      }

      payment.status = 'refunded';
      payment.refundAmount = amount || payment.amount;
      payment.refundReason = reason;
      payment.refundedAt = new Date();

      await payment.save();
      return payment;
    } catch (error) {
      console.error('Refund error:', error);
      throw new Error('Failed to process refund');
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId) {
    return await Payment.findById(paymentId).populate('userId', 'name email');
  }

  /**
   * Get user payments
   */
  async getUserPayments(userId, { status, limit = 20, skip = 0 }) {
    const query = { userId };
    if (status) query.status = status;

    return await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }
}

module.exports = new PaymentService();
