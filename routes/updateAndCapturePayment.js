// backend/routes/updateAndCapturePayment.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('../utils/supabaseClient');

router.patch('/update-payment', async (req, res) => {
  const { appointmentId, tipAmount } = req.body;

  try {
    // 1. Fetch the appointment to get the paymentIntentId
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('payment_intent_id')
      .eq('id', appointmentId)
      .single();

    if (error || !appointment) {
      return res.status(400).json({ success: false, message: 'Appointment not found.' });
    }

    const { payment_intent_id } = appointment;

    // 2. Update the PaymentIntent with the tip
    const updatedIntent = await stripe.paymentIntents.update(payment_intent_id, {
      amount: 4000 + Math.round(tipAmount * 100), // Example base = $40.00 + tip
    });

    // 3. Capture the updated PaymentIntent
    await stripe.paymentIntents.capture(payment_intent_id);

    res.json({ success: true });
  } catch (err) {
    console.error('Stripe capture error:', err);
    res.status(500).json({ success: false, message: 'Stripe capture failed.' });
  }
});

module.exports = router;
