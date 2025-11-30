# Alloy: The Integrated Student Productivity Hub

Alloy is a full-stack web application designed to centralize student academic life. It unifies scheduling, task management, attendance tracking, note-taking, and AI-powered study assistance into a single, cohesive platform.

## Key Features

* **Smart Dashboard:** Summary view of daily schedules, pending tasks, and attendance alerts.
* **Weekly Timetable:** Visual grid layout for recurring class schedules.
* **Attendance Tracker:** Calendar-based tracking with visual statistics and requirement monitoring.
* **Task Management:** Priority-based task list with sorting and filtering.
* **Integrated Notes:** Rich text editor (Quill) organized by subject with file attachment support.
* **AI Assistant:** Context-aware chat powered by Google Gemini for summarizing notes and generating study plans.
* **Coding Progress:** Web scraping integration (Puppeteer) to track LeetCode statistics.
* **Secure Authentication:** JWT-based login/registration with password reset via email.

## Tech Stack

**Frontend:**

* React (Vite)
* Tailwind CSS
* Axios
* Libraries: `react-calendar`, `react-chartjs-2`, `react-quill`, `react-markdown`

**Backend:**

* Node.js & Express.js
* MongoDB (Mongoose)
* JWT & Bcryptjs
* Libraries: `@google/generative-ai` (Gemini), `puppeteer` (Scraping), `multer` (Uploads), `nodemailer`

## Project Structure

```text
alloy/
├── client/                 # React Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI (MainLayout, Modal, etc.)
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Application views
│   │   └── services/       # API configuration
├── server/                 # Node.js Backend API
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Route Handlers
│   ├── middleware/         # Auth Middleware
│   └── uploads/            # Document storage
````

## Quick start

### 1\. Backend Setup

```bash
cd server
npm install
# Create .env file (see server/README.md)
npm start
```

### 2\. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.
