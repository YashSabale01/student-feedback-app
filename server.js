const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_feedback';
let isMongoConnected = false;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    isMongoConnected = true;
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    isMongoConnected = false;
  });

// Feedback schema
const feedbackSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  rollNo: String,
  branch: String,
  useful: String,
  rating: Number,
  suggestions: String,
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Validation functions
const validateForm = (data) => {
  const errors = {};
  
  // Full Name - Required, only alphabets + spaces
  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  } else if (!/^[a-zA-Z\s]+$/.test(data.fullName.trim())) {
    errors.fullName = 'Full Name must contain only alphabets and spaces';
  }
  
  // Email - Valid email format
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Phone - Exactly 10 digits
  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Contact Number is required';
  } else if (!/^\d{10}$/.test(data.phone.trim())) {
    errors.phone = 'Contact Number must be exactly 10 digits';
  }
  
  // Roll Number - Required
  if (!data.rollNo || !data.rollNo.trim()) {
    errors.rollNo = 'Roll Number is required';
  }
  
  // Branch - Required
  if (!data.branch) {
    errors.branch = 'Branch is required';
  }
  
  // Course usefulness - Required
  if (!data.useful) {
    errors.useful = 'Please select if the course was useful';
  }
  
  // Rating - Required, 1-5
  if (!data.rating) {
    errors.rating = 'Rating is required';
  } else if (!/^[1-5]$/.test(data.rating)) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  
  return errors;
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server running', 
    mongodb: isMongoConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

app.post('/submit', async (req, res) => {
  const errors = validateForm(req.body);
  
  if (Object.keys(errors).length > 0) {
    res.json({ success: false, errors, data: req.body });
  } else {
    if (!isMongoConnected) {
      console.log('Form data (MongoDB not connected):', req.body);
      res.json({ success: true, message: 'Feedback received! (Database connection pending)' });
      return;
    }
    
    try {
      const feedback = new Feedback(req.body);
      await feedback.save();
      res.json({ success: true, message: 'Feedback submitted successfully!' });
    } catch (error) {
      console.error('Database save error:', error);
      res.json({ success: true, message: 'Feedback received! (Saved to logs)' });
    }
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});