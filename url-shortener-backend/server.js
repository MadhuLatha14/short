const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow all origins for CORS
app.use(cors());
app.options("*", cors()); // Preflight handling

// ✅ Parse incoming JSON requests
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Use your routes
const urlRoutes = require('./routes/urlRoutes');
app.use('/', urlRoutes);

// ✅ Error handler with CORS headers fallback
app.use((err, req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(err.status || 500).json({ message: err.message });
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
