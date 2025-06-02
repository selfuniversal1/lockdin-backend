const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { amount, customerId, paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100 + 100, // Convert to cents + $1 fee
      currency: 'usd',
      capture_method: 'manual',
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true
    });

    res.json({ paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
