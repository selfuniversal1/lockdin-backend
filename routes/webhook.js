// backend/routes/webhook.js
const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const router = express.Router();

router.use(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log("✅ Webhook received:", event.type);
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription events here (expand as needed)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log("🎉 Checkout Session completed:", session.id);
      // You can store the subscription/customer ID here if needed
    }

    res.status(200).send({ received: true });
  }
);

module.exports = router;
