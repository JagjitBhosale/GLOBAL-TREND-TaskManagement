# Starting the Backend Server

## Quick Start

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

## Verify Server is Running

The server should start on `http://localhost:5000`

You should see:
```
MongoDB Connected: cluster0.gntfdxt.mongodb.net
Server running on port 5000
Environment: development
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, change the PORT in `.env` file:
```
PORT=5001
```

### MongoDB Connection Error
Check that your `.env` file has the correct MongoDB URI:
```
MONGODB_URI=mongodb+srv://bhosalejagjit_db_user:2njXdjdOpeHvPjoO@cluster0.gntfdxt.mongodb.net/taskflow?retryWrites=true&w=majority
```

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.
