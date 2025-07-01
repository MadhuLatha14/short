const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urlRoutes');
const logger = require('./middlewares/logger');
dotenv.config();
const app = express();
const cors = require("cors");
app.use(cors());

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(logger); 
app.use('/', urlRoutes);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
});
