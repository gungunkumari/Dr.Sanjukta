const express = require('express');
const cors = require('cors');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');

const app = express();

// ============================================================
// SUPABASE
// ============================================================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ============================================================
// STATIC FILES
// ============================================================

app.use(express.static(path.join(__dirname, '../public')));

// ============================================================
// HOME ROUTE
// ============================================================

app.get('/', (req, res) => {

  res.sendFile(
    path.join(__dirname, '../public/index.html')
  );
});

// ============================================================
// PORTAL ROUTE
// ============================================================

app.get('/portal', (req, res) => {

  res.sendFile(
    path.join(__dirname, '../portal.html')
  );
});

// ============================================================
// TEST ROUTE
// ============================================================

app.get('/api/test', (req, res) => {

  res.json({
    success: true,
    message: 'Backend working'
  });
});

// ============================================================
// CREATE APPOINTMENT
// ============================================================

app.post('/api/appointment', async (req, res) => {

  try {

    const { name, phone, email, message } = req.body;

    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          name,
          phone,
          email,
          message,
          date: new Date().toLocaleDateString('en-IN'),
          time: new Date().toLocaleTimeString('en-IN'),
          status: 'Pending'
        }
      ]);

    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ============================================================
// GET APPOINTMENTS
// ============================================================

app.get('/api/appointments', async (req, res) => {

  try {

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('id', { ascending: false });

    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true,
      appointments: data
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ============================================================
// UPDATE STATUS
// ============================================================

app.patch('/api/appointments/:id', async (req, res) => {

  try {

    const { status } = req.body;

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', req.params.id);

    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ============================================================
// DELETE APPOINTMENT
// ============================================================

app.delete('/api/appointments/:id', async (req, res) => {

  try {

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', req.params.id);

    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ============================================================
// EXPORT
// ============================================================

module.exports = app;