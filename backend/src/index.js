
require('dotenv').config({ path: './backend/src/.env' });
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const crypto = require('crypto');
const passport = require('passport');
const axios = require('axios');

// Import routes
const authRoutes = require('./routes/auth.routes');
const pageRoutes = require('./routes/page.routes');
const serviceRoutes = require('./routes/service.routes');
const categoryRoutes = require('./routes/categories.routes');
const providerDashboardRoutes = require('./routes/providerDashboard.route');
const homePageRoutes = require("./routes/homePage.routes");

// Import Sequelize associations
require('./models/associations');

// Import Passport configuration
require('./config/passport')(passport);

const allowedOrigins = ['https://quickfind-38321514be2b.herokuapp.com', 'http://127.0.0.1:5500', 'http://localhost:3000'];

const app = express();

// Middleware to generate a nonce
app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});

// Helmet for CSP and other security headers
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdnjs.cloudflare.com",
                ],
                scriptSrc: [
                    "'self'",
                    (req, res) => `'nonce-${res.locals.nonce}'`,
                    "https://cdn.tailwindcss.com",
                    "https://cdn.jsdelivr.net/npm/sweetalert2@11",
                    "https://www.gstatic.com/firebasejs/10.5.0",
                    "https://www.gstatic.com",
                    "https://firebase.googleapis.com",
                    "https://www.google.com",
                    "https://www.gstatic.com/recaptcha/",
                    "https://www.payhere.lk",
                    "https://sandbox.payhere.lk",
                    "https://www.google-analytics.com",
                    "https://maxcdn.bootstrapcdn.com",
                    "'unsafe-inline'",
                    "https://sandbox.payhere.lk/pay/resources/js/jquery.min.js",
                    "https://sandbox.payhere.lk/pay/resources/js/common.js",
                    "https://sandbox.payhere.lk/pay/resources/js/complete_error.js",
                ],
                connectSrc: [
                    "'self'",
                    "https://www.googleapis.com",
                    "https://securetoken.googleapis.com",
                    "https://firestore.googleapis.com",
                    "https://www.gstatic.com",
                    "https://www.google.com",
                    "https://identitytoolkit.googleapis.com",
                    "https://securetoken.googleapis.com",
                    "https://sandbox.payhere.lk",
                    "https://www.payhere.lk",
                ],
                frameSrc: [
                    "'self'",
                    "https://www.google.com/recaptcha/",
                    "https://recaptcha.google.com/recaptcha/",
                    "https://sandbox.payhere.lk",
                    "https://www.payhere.lk",
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https://www.gstatic.com",
                ],
            },
        },
        crossOriginEmbedderPolicy: false,
    })
);


// Middleware
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/icons', express.static(path.join(__dirname, '../../frontend/icons')));

// Routes
app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providerDashboard', providerDashboardRoutes);
app.use("/api/homepage", homePageRoutes);

// Payhere proxy endpoint
app.get('/success', (req, res) => {
    console.log('Payment successful');
    res.send('Payment processed successfully');
});

app.get('/cancel', (req, res) => {
    console.log('Payment cancelled');
    res.send('Payment was cancelled');
});
app.post('/payhere-proxy', async (req, res) => {
    const { merchant_id, app_id, return_url, cancel_url, amount, currency, first_name, last_name, email, phone } = req.body;

    // Validate required fields
    if (!merchant_id || !app_id || !return_url || !cancel_url || !amount || !currency || !first_name || !last_name || !email || !phone) {
        return res.status(400).json({ error: 'Missing required payment details' });
    }

    try {
        const response = await axios.post('https://sandbox.payhere.lk/pay/checkoutJ', req.body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Payhere proxy error:', error.response?.data || error);
        res.status(500).json({ error: 'Payment initialization failed', details: error.response?.data || error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log('Database connected and synchronized');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
