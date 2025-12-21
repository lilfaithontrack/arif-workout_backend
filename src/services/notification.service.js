class NotificationService {
  /**
   * Send email notification
   */
  async sendEmail({ to, subject, html, text }) {
    if (!process.env.EMAIL_HOST) {
      console.log(`[DEV MODE] Email to ${to}: ${subject}`);
      return { success: true, dev: true };
    }

    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text
      });

      return { success: true };
    } catch (error) {
      console.error('Email notification error:', error);
      throw new Error('Failed to send email notification');
    }
  }

  /**
   * Notify admin of new course submission
   */
  async notifyCourseSubmission(course, instructor) {
    const subject = 'New Course Submission for Review';
    const html = `
      <h2>New Course Submitted</h2>
      <p><strong>Course:</strong> ${course.title}</p>
      <p><strong>Instructor:</strong> ${instructor.name}</p>
      <p><strong>Category:</strong> ${course.categoryId}</p>
      <p><strong>Price:</strong> ${course.currency} ${course.price}</p>
      <p>Please review and approve/reject this course.</p>
    `;

    // In production, get admin emails from database
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    
    return await this.sendEmail({
      to: adminEmail,
      subject,
      html
    });
  }

  /**
   * Notify instructor of course approval/rejection
   */
  async notifyCourseStatus(course, instructor, status, notes) {
    const subject = `Course ${status === 'approved' ? 'Approved' : 'Rejected'}: ${course.title}`;
    const html = `
      <h2>Course ${status === 'approved' ? 'Approved' : 'Rejected'}</h2>
      <p>Hello ${instructor.name},</p>
      <p>Your course "<strong>${course.title}</strong>" has been ${status}.</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      <p>Thank you!</p>
    `;

    return await this.sendEmail({
      to: instructor.email,
      subject,
      html
    });
  }

  /**
   * Notify user of subscription renewal
   */
  async notifySubscriptionRenewal(user, subscription, pkg) {
    const subject = 'Subscription Renewal Confirmation';
    const html = `
      <h2>Subscription Renewed</h2>
      <p>Hello ${user.name},</p>
      <p>Your subscription to "<strong>${pkg.title}</strong>" has been renewed.</p>
      <p><strong>Amount:</strong> ${subscription.currency} ${subscription.amount}</p>
      <p><strong>Next Billing Date:</strong> ${subscription.nextBillingDate.toLocaleDateString()}</p>
      <p>Thank you for your continued support!</p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  /**
   * Notify user of payment failure
   */
  async notifyPaymentFailure(user, payment) {
    const subject = 'Payment Failed';
    const html = `
      <h2>Payment Failed</h2>
      <p>Hello ${user.name},</p>
      <p>We were unable to process your payment of ${payment.currency} ${payment.amount}.</p>
      <p><strong>Reason:</strong> ${payment.failureReason || 'Unknown'}</p>
      <p>Please update your payment method to continue using our services.</p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Arif Workout!';
    const html = `
      <h2>Welcome ${user.name}!</h2>
      <p>Thank you for joining Arif Workout. We're excited to have you on board!</p>
      <p>Start exploring our courses and packages to begin your fitness journey.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }
}

module.exports = new NotificationService();
