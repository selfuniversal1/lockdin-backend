const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/capture-payment', async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const intent = await stripe.paymentIntents.capture(paymentIntentId);
    res.json({ success: true, captured: intent });
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
