const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const questionnaireRoutes = require('./routes/questionnaire');
const appointmentRoutes = require('./routes/appointment');
const messageRoutes = require('./routes/message');
const conversationRoutes = require('./routes/conversation');

const app = express();
const PORT = process.env.PORT || 7003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const apiPrefix = process.env.API_PREFIX || '/alibaba-ai/v1';
app.use(apiPrefix, authRoutes);
app.use(apiPrefix, questionnaireRoutes);
app.use(apiPrefix, appointmentRoutes);
app.use(apiPrefix, messageRoutes);
app.use(`${apiPrefix}/conversation`, conversationRoutes);

app.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: 'Study-mate server is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'API endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Study-mate server error:', err);
  res.status(500).json({
    code: 500,
    message: 'Internal server error: ' + err.message
  });
});

app.listen(PORT, () => {
  console.log(`Study-mate server running at http://localhost:${PORT}`);
  console.log(`API prefix: ${apiPrefix}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
