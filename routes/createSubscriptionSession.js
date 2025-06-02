// routes/createSubscriptionSession.js
const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Load your Stripe secret key from .env

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID, // Your price ID from Stripe
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/provider-dashboard?subscribed=true`,
      cancel_url: `${process.env.CLIENT_URL}/provider-dashboard?subscribed=false`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session error:', error.message);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

module.exports = router;
