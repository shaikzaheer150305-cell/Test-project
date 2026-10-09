const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');
  if (!frontendUrl) return res.status(503).json({ status: 'frontend_url_not_configured' });
  res.redirect(302, `${frontendUrl}/login`);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
