const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: generate recurrence dates
function generateRecurrenceDates(startDate, rule, endDate) {
  const dates = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  const step = {
    weekly: 7,
    biweekly: 14,
    monthly: 30 // approx
  }[rule];

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + step);
  }
  return dates;
}

// POST /book
router.post('/book', async (req, res) => {
  const {
    customer_id,
    service_provider_id,
    appointment_date,
    appointment_time,
    services,
    is_recurring,
    recurrence_rule,
    recurrence_end_date
  } = req.body;

  if (!customer_id || !service_provider_id || !appointment_date || !appointment_time || !services) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const recurrence_id = is_recurring ? uuidv4() : null;

  const dates = is_recurring
    ? generateRecurrenceDates(appointment_date, recurrence_rule, recurrence_end_date)
    : [new Date(appointment_date)];

  const inserts = dates.map((date) => {
    return {
      id: uuidv4(),
      customer_id,
      service_provider_id,
      appointment_date: date.toISOString().split('T')[0],
      appointment_time,
      services,
      is_recurring,
      recurrence_id,
      recurrence_rule,
      recurrence_end_date
    };
  });

  const { error } = await supabase.from('appointments').insert(inserts);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true, appointments: inserts.length });
});

module.exports = router;

