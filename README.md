# TaskFlow - Smart Task Management Application

A full-stack task management application built with Next.js and Node.js. Organize your work, track productivity, and visualize your consistency with real-time analytics.

![TaskFlow](https://img.shields.io/badge/TaskFlow-v1.0.0-blue) ![Node](https://img.shields.io/badge/Node.js-18+-green) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | Email/password signup & login, Google OAuth integration |
| **📋 Task Management** | Create, read, update, delete tasks with status tracking (Pending → In Progress → Completed) |
| **📊 Analytics Dashboard** | Daily consistency trends, weekly performance charts, completion rate & streak tracking |
| **👤 User Profile** | Profile settings, consistency analysis, and personal statistics |
| **🎨 Modern UI** | Responsive design, dark mode, Tailwind CSS, shadcn/ui components |
| **🔒 Secure** | JWT authentication, bcrypt password hashing, protected API routes |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Auth** | JWT, bcryptjs, Google OAuth |

---

## 📋 Prerequisites

- **Node.js** 18 or higher
- **npm** or **pnpm**
- **MongoDB Atlas** account (for database)
- **Google Cloud Console** project (optional, for Google OAuth)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env.local` file in the `Frontend` folder:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## ▶️ Running the Project

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:5000  

### Production Build

```bash
# Backend
cd Backend && npm start

# Frontend
cd Frontend && npm run build && npm start
```

---

## 📁 Project Structure

```
Task Management App/
├── Backend/
│   ├── config/          # Database connection
│   ├── models/          # User, Task, MonthlyConsistency schemas
│   ├── routes/          # Auth, tasks, consistency API routes
│   ├── middleware/      # JWT authentication
│   ├── utils/           # Token generation
│   └── index.js         # Express server entry
│
├── Frontend/
│   ├── app/             # Next.js App Router pages
│   │   ├── login/       # Login page
│   │   ├── signup/      # Signup page
│   │   ├── dashboard/   # Main task dashboard
│   │   └── profile/     # User profile & analytics
│   ├── components/     # React components
│   └── types/           # TypeScript interfaces
│
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user (protected) |
| GET | `/api/tasks` | Get all tasks (protected) |
| POST | `/api/tasks` | Create task (protected) |
| PUT | `/api/tasks/:id` | Update task (protected) |
| DELETE | `/api/tasks/:id` | Delete task (protected) |
| GET | `/api/consistency/stats` | Get consistency statistics (protected) |

---

## 🌐 Live Demo

- **Frontend:** [Add your deployed frontend URL]
- **Backend:** https://global-trend-taskmanagement.onrender.com

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Your Name**  
GitHub: [@your-username](https://github.com/your-username)

---

<p align="center">
  Made with ❤️ for productivity
</p>
