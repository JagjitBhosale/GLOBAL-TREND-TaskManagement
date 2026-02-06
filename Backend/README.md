# TaskFlow Backend API

Backend server for TaskFlow task management application with MongoDB Atlas integration.

## Features

- User authentication (signup/login) with JWT
- Task CRUD operations
- Monthly consistency tracking
- MongoDB Atlas database integration
- Secure password hashing with bcrypt
- Protected routes with JWT middleware

## Database Schema

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `googleAuth`: Boolean (default: false)
- `googleId`: String (optional)
- `createdAt`: Date
- `lastLogin`: Date

### Task Model
- `userId`: ObjectId (reference to User)
- `title`: String (required)
- `description`: String (optional)
- `status`: Enum ['pending', 'in-progress', 'completed']
- `completedAt`: Date (auto-set when status is completed)
- `createdAt`: Date
- `updatedAt`: Date

### MonthlyConsistency Model
- `userId`: ObjectId (reference to User)
- `year`: Number (required)
- `month`: Number (required, 1-12)
- `totalTasks`: Number
- `completedTasks`: Number
- `inProgressTasks`: Number
- `pendingTasks`: Number
- `completionRate`: Number (0-100, auto-calculated)
- `activeDays`: Number (days with task activity)
- `streak`: Number (consecutive active days)
- `lastActiveDate`: Date

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

3. Start the server:
```bash
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### GET `/api/auth/me`
Get current user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Task Routes (`/api/tasks`)

All task routes require authentication. Include `Authorization: Bearer <token>` header.

#### GET `/api/tasks`
Get all tasks for the logged-in user.

**Query Parameters:**
- `status`: Filter by status (pending, in-progress, completed)
- `sort`: Sort order (default: -createdAt)

**Example:** `/api/tasks?status=completed&sort=-createdAt`

#### GET `/api/tasks/:id`
Get a single task by ID.

#### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "pending"
}
```

#### PUT `/api/tasks/:id`
Update a task.

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "completed"
}
```

#### DELETE `/api/tasks/:id`
Delete a task.

### Consistency Routes (`/api/consistency`)

All consistency routes require authentication.

#### GET `/api/consistency`
Get monthly consistency data.

**Query Parameters:**
- `year`: Filter by year
- `month`: Filter by month (1-12)

#### GET `/api/consistency/stats`
Get overall statistics for the user.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMonths": 3,
    "averageCompletionRate": 75.5,
    "totalTasks": 50,
    "totalCompletedTasks": 38,
    "longestStreak": 15,
    "currentStreak": 5,
    "monthlyData": [...]
  }
}
```

#### GET `/api/consistency/:year/:month`
Get specific month consistency data.

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected routes with middleware
- Password validation (minimum 8 characters)
- Email validation

## MongoDB Connection

The server connects to MongoDB Atlas using the connection string in `.env`. The database name is `taskflow` (can be changed in the connection string).

## Notes

- Monthly consistency is automatically updated when tasks are created, updated, or deleted
- Task completion rate is calculated automatically
- All timestamps are in UTC
- The server runs on port 5000 by default
