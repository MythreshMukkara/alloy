# Alloy Frontend Client

The user interface for Alloy, built with React, Vite, and Tailwind CSS. It features a responsive dashboard, dark mode support, and interactive data visualization.

## ⚙️ Configuration

The API base URL is configured in `src/services/api.service.js`.

* **Development:** Defaults to `http://localhost:3232/api`.
* **Production:** Reads from `import.meta.env.VITE_API_URL`.

## 📜 Scripts

* `npm run dev`: Starts the development server at `http://localhost:5173`.
* `npm run build`: Compiles the app for production.
* `npm run preview`: Previews the production build locally.

## 🧩 Key Components

* **MainLayout:** Handles the collapsible sidebar, header, and dark mode toggle.
* **PublicLayout:** Handles the split-screen landing page and auth forms.
* **ProtectedRoute:** Restricts access to authenticated users only.
* **AuthContext:** Manages global login state and user data.

## 🎨 UI/UX Features

* **Styling:** Tailwind CSS for utility-first styling.
* **Dark Mode:** System-wide dark theme toggle.
* **Visualizations:** Charts provided by `react-chartjs-2`.
* **Editor:** `react-quill` for rich text note-taking.
* **Calendar:** `react-calendar` for attendance tracking.
* **Markdown:** `react-markdown` for rendering AI responses.

## 📂 Page Structure

* `/`: Landing Page (PublicLayout)
* `/app/dashboard`: Main widget overview.
* `/app/schedule`: Tabbed view for Timetable and Tasks.
* `/app/attendance`: Calendar and stats tracking.
* `/app/notes`: Three-pane note manager with attachments.
* `/app/ai-assistant`: Chat interface.

```text
client/
├── public/
│  
├── src/
│   ├── components/             # Reusable UI Components
│   │   ├── DocumentManager.jsx # File upload and management
│   │   ├── MainLayout.jsx      # Protected app shell with Sidebar & Header
│   │   ├── Modal.jsx           # Reusable Modal/Dialog
│   │   ├── ProtectedRoute.jsx  # Security guard for private routes
│   │   ├── PublicLayout.jsx    # Public shell (Landing page, Login/Register)
│   │   ├── TasksComponent.jsx  # Reusable Task list widget
│   │   └── TimetableComponent.jsx # Reusable Schedule grid widget
│   │
│   ├── context/                # Global State
│   │   └── auth.context.jsx    # Auth provider (Login state, User data)
│   │
│   ├── pages/                  # Page Views (Routes)
│   │   ├── AIAssistantPage.jsx # Chat interface
│   │   ├── AboutUsPage.jsx     # About Us content
│   │   ├── AttendancePage.jsx  # Attendance tracker & charts
│   │   ├── ContactPage.jsx     # Contact form
│   │   ├── DashboardPage.jsx   # Main dashboard with widgets
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── HomePage.jsx        # Landing page content
│   │   ├── LoginPage.jsx
│   │   ├── NotesPage.jsx       # 3-column Notes manager
│   │   ├── PrivacyPolicyPage.jsx
│   │   ├── ProfilePage.jsx     # User profile management
│   │   ├── RegisterPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── SchedulePage.jsx    # Container for Timetable & Tasks
│   │   ├── SettingsPage.jsx    # App preferences
│   │
│   ├── services/               # API Configuration
│   │   └── api.service.js      # Axios instance with Interceptors
│   │
│   ├── App.jsx                 # Main Router configuration
│   ├── App.css                 # General styles (if any)
│   ├── index.css               # Tailwind CSS imports & global styles
│   └── main.jsx                # Entry point (Providers wrapper)
│
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```
