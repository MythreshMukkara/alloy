# Alloy Backend API

The backend server for Alloy, built with Node.js and Express. It handles database operations, authentication, AI integration, and web scraping.

## ⚙️ Configuration (.env)

Create a `.env` file in this directory with the following variables:

```env
PORT=3232
MONGO_URI=mongodb://127.0.0.1:27017/studentHubDB  # Or MongoDB Atlas URI
JWT_SECRET=your_super_secure_random_string
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

## 📜 Scripts

- **`npm start`**: Runs the server using `node server.js`.
- **`npm run dev`**: Runs the server with `nodemon` for automatic hot-reloading.

## 🔌 API Endpoints

### Authentication

- **POST `/api/auth/register`**: Register a new user.
- **POST `/api/auth/login`**: Authenticate and receive a JWT.
- **GET `/api/auth/me`**: Retrieve current user details.
- **PUT `/api/auth/update`**: Update user profile.
- **DELETE `/api/auth/delete`**: Delete user account and all associated data.

### Core Features

- **`/api/subjects`**: CRUD operations for subjects.
- **`/api/timetable`**: Manage weekly class schedules.
- **`/api/attendance`**: Mark attendance and view statistics.
- **`/api/tasks`**: Manage to-do lists with priority sorting.
- **`/api/notes`**: Create and manage rich text notes.
- **`/api/documents`**: Upload and delete files (via Multer).

### Advanced Features

- **POST `/api/ai/chat`**: Interact with Google Gemini (context-aware AI chat).

## 📦 Key Dependencies

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **@google/generative-ai**: AI integration
- **multer**: File uploads
- **nodemailer**: Email services
