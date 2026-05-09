// ============================================================
// index.js — Dr. Sanjukta Banerjee — Backend
// Vercel Serverless Version
// ============================================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// ============================================================
// FILE PATHS
// ============================================================

// IMPORTANT:
// index.js is now inside /api
// so we use ../ to reach root folder

const APPOINTMENTS_FILE = path.join(__dirname, '../appointments.json');

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// SERVE STATIC FRONTEND
// ============================================================

// Serve everything inside /public

app.use(express.static(path.join(__dirname, '../public')));

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Read appointments from JSON file

function readAppointments() {

  // Create file if missing
  if (!fs.existsSync(APPOINTMENTS_FILE)) {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify([]));
  }

  const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf8');

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Error parsing appointments.json');
    return [];
  }
}

// Save appointments

function saveAppointments(appointments) {

  fs.writeFileSync(
    APPOINTMENTS_FILE,
    JSON.stringify(appointments, null, 2)
  );
}

// ============================================================
// ROUTES
// ============================================================

// ------------------------------------------------------------
// HOME PAGE
// ------------------------------------------------------------

app.get('/', (req, res) => {

  res.sendFile(
    path.join(__dirname, '../public/index.html')
  );
});

// ------------------------------------------------------------
// DOCTOR PORTAL
// ------------------------------------------------------------

app.get('/portal', (req, res) => {

  res.sendFile(
    path.join(__dirname, '../portal.html')
  );
});

// ============================================================
// API ROUTES
// ============================================================

// ------------------------------------------------------------
// POST /appointment
// ------------------------------------------------------------

app.post('/appointment', (req, res) => {

  const { name, phone, email, message } = req.body;

  // Validation
  if (!name || !phone || !email) {

    return res.status(400).json({
      success: false,
      error: 'Name, phone and email are required.'
    });
  }

  // Create appointment object
  const newAppointment = {

    id: Date.now(),

    name: name.trim(),

    phone: phone.trim(),

    email: email.trim(),

    message: (message || 'No message').trim(),

    date: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),

    time: new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),

    status: 'Pending'
  };

  // Read existing appointments
  const appointments = readAppointments();

  // Add newest first
  appointments.unshift(newAppointment);

  // Save
  saveAppointments(appointments);

  console.log(`✅ New appointment saved: ${name}`);

  return res.status(200).json({
    success: true,
    message: 'Appointment booked successfully!'
  });
});

// ------------------------------------------------------------
// GET /appointments
// ------------------------------------------------------------

app.get('/appointments', (req, res) => {

  const appointments = readAppointments();

  res.json({
    success: true,
    appointments
  });
});

// ------------------------------------------------------------
// PATCH /appointments/:id
// ------------------------------------------------------------

app.patch('/appointments/:id', (req, res) => {

  const id = parseInt(req.params.id);

  const status = req.body.status;

  const appointments = readAppointments();

  const index = appointments.findIndex(a => a.id === id);

  if (index === -1) {

    return res.status(404).json({
      success: false,
      error: 'Appointment not found'
    });
  }

  appointments[index].status = status;

  saveAppointments(appointments);

  console.log(`✅ Appointment ${id} updated`);

  res.json({
    success: true,
    message: 'Status updated successfully'
  });
});

// ------------------------------------------------------------
// DELETE /appointments/:id
// ------------------------------------------------------------

app.delete('/appointments/:id', (req, res) => {

  const id = parseInt(req.params.id);

  let appointments = readAppointments();

  appointments = appointments.filter(a => a.id !== id);

  saveAppointments(appointments);

  console.log(`🗑️ Appointment ${id} deleted`);

  res.json({
    success: true,
    message: 'Appointment deleted successfully'
  });
});

// ============================================================
// EXPORT APP FOR VERCEL
// ============================================================

module.exports = app;