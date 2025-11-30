/**
 * File: src/index.js
 * Description: Entry point for the Express server. Configures environment,
 * middleware, and mounts API routes. Connects to MongoDB and starts the HTTP server.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');;
const taskRoutes = require('./routes/task.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const subjectRoutes = require('./routes/subjects.routes');
const noteRoutes = require('./routes/notes.routes');
const aiRoutes = require('./routes/ai.routes');
const timetableRoutes = require('./routes/timetable.routes');
const documentRoutes = require('./routes/document.routes');


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);

app.use('/uploads', express.static('uploads'));

// Serve client build in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });
