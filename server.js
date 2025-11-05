// This is a foundational server setup.
// To build the full backend, create a '/backend' directory and move this file into it.
// Then, create the other required files (routes, models, controllers) as per the architecture.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    // Avoid connecting if URI is not set, to prevent crashes on startup for checks
    if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<db_password>')) {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } else {
        console.warn('MONGO_URI not configured. Skipping DB connection.');
    }
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

const app = express();

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());

// Body parser middleware to handle JSON data
app.use(express.json());


// --- API Routes ---
// This is a placeholder. In the full backend, you would import and use your route files here.
// For example:
// const dishRoutes = require('./routes/dishRoutes');
// app.use('/api/dishes', dishRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Sakura Backend is running!' });
});

// Routes for the deployCheck script
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/auth/check', (req, res) => {
  // In a real app, this would check for a valid token
  res.json({ authenticated: false, message: 'Auth endpoint is active' });
});

app.get('/api/reservations', (req, res) => {
  // In a real app, this would be a protected route
  res.json({ message: 'Reservations endpoint is active' });
});


// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));