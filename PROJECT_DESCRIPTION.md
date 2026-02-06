# TaskFlow - Smart Task Management Application

## Project Overview

TaskFlow is a full-stack task management application designed to help users organize their work, boost productivity, and track their consistency over time. The application features a modern, responsive user interface with real-time task management, comprehensive analytics, and secure authentication.

## Key Features

### 🔐 Authentication & User Management
- **Email/Password Authentication**: Secure signup and login with password hashing (bcrypt)
- **Google OAuth Integration**: One-click sign-in using Google Identity Services
- **JWT-based Session Management**: Secure token-based authentication
- **User Profile Management**: Update profile information and manage account settings

### 📋 Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Status Tracking**: Three status levels - Pending, In Progress, Completed
- **Task Organization**: Tasks automatically grouped by status with visual indicators
- **Task Details**: Title and description fields for comprehensive task information
- **Real-time Updates**: Instant UI updates when tasks are created or modified

### 📊 Analytics & Consistency Tracking
- **Daily Consistency Trend**: Line chart showing daily task completion consistency
- **Weekly Performance**: Bar chart comparing completed tasks vs. targets
- **Consistency Score**: Overall performance metric calculated from task completion rates
- **Monthly Statistics**: Automatic tracking of monthly task activity
- **Streak Tracking**: Best and current streak calculations
- **Task Statistics**: Total, completed, in-progress, and pending task counts
- **Completion Rate**: Visual progress indicators and percentage calculations

### 🎨 User Interface
- **Modern Design**: Clean, minimalist interface with gradient backgrounds
- **Dark Mode Support**: Full theme switching capability
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Charts**: Beautiful data visualizations using Recharts
- **Real-time Feedback**: Loading states, error messages, and success indicators
- **Accessible Components**: Built with shadcn/ui components for accessibility

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5.7.3
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4.17
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts 2.15.0
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns 4.1.0
- **Notifications**: Sonner (toast notifications)
- **Theme Management**: next-themes
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB Atlas (Cloud Database)
- **ODM**: Mongoose 8.8.4
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs 2.4.3
- **Google OAuth**: google-auth-library 9.15.1
- **CORS**: Enabled for cross-origin requests
- **Environment Variables**: dotenv for configuration

### Database Schema

#### User Model
- `name`: User's full name
- `email`: Unique email address (used for login)
- `password`: Hashed password (bcrypt)
- `googleAuth`: Boolean flag for Google authentication
- `googleId`: Google user ID (if authenticated via Google)
- `createdAt`: Account creation timestamp
- `lastLogin`: Last login timestamp

#### Task Model
- `userId`: Reference to User (ObjectId)
- `title`: Task title (required, max 200 chars)
- `description`: Task description (optional, max 1000 chars)
- `status`: Enum ['pending', 'in-progress', 'completed']
- `completedAt`: Timestamp when task was completed
- `createdAt`: Task creation timestamp
- `updatedAt`: Last update timestamp

#### MonthlyConsistency Model
- `userId`: Reference to User (ObjectId)
- `year`: Year (number)
- `month`: Month (1-12)
- `totalTasks`: Total tasks created in the month
- `completedTasks`: Tasks completed in the month
- `inProgressTasks`: Tasks in progress
- `pendingTasks`: Pending tasks
- `completionRate`: Auto-calculated percentage (0-100)
- `activeDays`: Number of days with task activity
- `streak`: Consecutive active days
- `lastActiveDate`: Last activity timestamp

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/me` - Get current user (protected)

### Tasks (`/api/tasks`)
- `GET /api/tasks` - Get all user tasks (with optional status filter)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Consistency (`/api/consistency`)
- `GET /api/consistency` - Get monthly consistency data
- `GET /api/consistency/stats` - Get overall statistics
- `GET /api/consistency/:year/:month` - Get specific month data

## Project Structure

```
Task Management App/
├── Backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Task.js              # Task schema
│   │   └── MonthlyConsistency.js # Consistency schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── tasks.js             # Task CRUD routes
│   │   └── consistency.js       # Analytics routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── utils/
│   │   └── generateToken.js     # JWT token generation
│   ├── index.js                 # Express server entry point
│   ├── .env                     # Environment variables
│   └── package.json             # Dependencies
│
└── Frontend/
    ├── app/
    │   ├── layout.tsx           # Root layout
    │   ├── page.tsx             # Home page (redirects)
    │   ├── login/
    │   │   └── page.tsx         # Login page
    │   ├── signup/
    │   │   └── page.tsx         # Signup page
    │   ├── dashboard/
    │   │   └── page.tsx         # Main dashboard
    │   └── profile/
    │       └── page.tsx         # User profile & analytics
    ├── components/
    │   ├── ui/                  # shadcn/ui components (40+)
    │   ├── auth-card.tsx        # Auth wrapper component
    │   ├── header.tsx           # Navigation header
    │   ├── task-form.tsx        # Task creation form
    │   ├── task-list.tsx        # Task list container
    │   ├── task-card.tsx        # Individual task card
    │   ├── task-stats.tsx       # Task statistics display
    │   ├── consistency-analysis.tsx # Analytics charts
    │   └── ...                  # Other components
    ├── types/
    │   └── task.ts              # TypeScript interfaces
    ├── lib/
    │   └── utils.ts            # Utility functions
    └── package.json             # Dependencies
```

## Key Features in Detail

### 1. Task Management
- **Create Tasks**: Quick task creation with title and optional description
- **Status Management**: Easy status transitions (Pending → In Progress → Completed)
- **Task Organization**: Automatic grouping by status with visual indicators
- **Task Statistics**: Real-time counts and completion rates
- **Delete Tasks**: Remove tasks with confirmation

### 2. Analytics Dashboard
- **Daily Trends**: 30-day consistency visualization
- **Weekly Performance**: Week-over-week task completion comparison
- **Consistency Score**: Overall performance percentage
- **Streak Tracking**: Longest and current activity streaks
- **Monthly Insights**: Detailed monthly breakdowns

### 3. Security Features
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure, stateless authentication
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs

### 4. User Experience
- **Responsive Design**: Mobile-first approach
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Theme Support**: Light/dark mode switching
- **Accessibility**: WCAG-compliant components

## Database Features

### Automatic Calculations
- **Monthly Consistency**: Automatically updated when tasks are created/updated/deleted
- **Completion Rate**: Auto-calculated percentage based on task status
- **Active Days**: Tracks unique days with task activity
- **Streaks**: Calculates consecutive active periods

### Indexes
- User ID indexes for fast queries
- Compound indexes for monthly consistency lookups
- Status-based indexes for task filtering

## Development Setup

### Backend Setup
1. Navigate to `Backend` directory
2. Install dependencies: `npm install`
3. Configure `.env` file with MongoDB URI and JWT secret
4. Start server: `npm run dev` (development) or `npm start` (production)

### Frontend Setup
1. Navigate to `Frontend` directory
2. Install dependencies: `npm install` or `pnpm install`
3. Configure environment variables (optional)
4. Start development server: `npm run dev`

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your-google-client-id
```

### Frontend (optional .env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Deployment Considerations

- **Backend**: Can be deployed on Heroku, Railway, Render, or any Node.js hosting
- **Frontend**: Can be deployed on Vercel, Netlify, or any static hosting
- **Database**: MongoDB Atlas (already configured)
- **Environment Variables**: Must be set in production environment
- **CORS**: Update allowed origins for production domain

## Future Enhancements

- Task categories/tags
- Task due dates and reminders
- Task priority levels
- Task search and filtering
- Export/import functionality
- Team collaboration features
- Task templates
- Recurring tasks
- Email notifications
- Mobile app (React Native)

## License

ISC

## Author

TaskFlow Development Team

---

**Note**: This is a production-ready task management application with full authentication, database integration, and analytics capabilities. All data is securely stored in MongoDB Atlas and user sessions are managed via JWT tokens.
