const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./Config/swagger');
const multer = require('multer');
const { generalLimiter } = require('./Middlewares/rateLimiter.middleware');
const { userAgentMiddleware } = require('./Middlewares/UserAgent.middleware');
const logger = require('./Utils/logger.utils');
const user_agent = require('express-useragent');

const path = require('path');

const app = express();

// Apply CORS globally before anything else
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parse cookies
app.use(cookieParser());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../Uploads')));

// Apply rate limiters
app.use(generalLimiter);

// Apply user agent middleware
app.use(user_agent.express());
app.use(userAgentMiddleware);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve);
app.get(
  '/api-docs',
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'SupportDesk API Documentation',
    customfavIcon: '/assets/favicon.ico',
  })
);

// API Routes
app.use(`/api/v1`, require('./Router'));

// Error handling middleware
app.use((err, _, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error('Multer Error:', { error: err.message, stack: err.stack });
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    logger.error('Unknown Error:', { error: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
  next();
});

module.exports = app;
