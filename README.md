# ClassManager Web Application

A web application for teachers to create classes and manage students, built with React, Node.js, SQLite, and plain HTML/CSS.

## Project Overview

ClassManager is designed to help teachers organize their classes and students. Teachers can sign up, create classes, add students, track attendance, create assignments, and record grades.

## Features

- User authentication (signup, login)
- Class creation and management
- Student management
- Attendance tracking
- Assignment creation
- Grade management

## Tech Stack

- **Frontend**: React, HTML, CSS
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

The project is organized into two main directories:

- `/client`: React frontend application
- `/server`: Node.js backend API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

#### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm run dev
   ```
   
   The server will run on http://localhost:5000

#### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

   The application will open in your browser at http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

## Database Schema

The application uses a SQLite database with the following tables:

- **users**: Store user information (teachers)
- **classes**: Store class information
- **students**: Store student information
- **attendance**: Track student attendance
- **assignments**: Store assignment information
- **grades**: Store student grades

## Development

### Backend Development

The backend uses Express.js framework with the following structure:

- `server.js`: Entry point of the application
- `/config`: Configuration files
- `/controllers`: Request handlers
- `/routes`: API routes
- `/services`: Business logic
- `/middleware`: Express middleware
- `/db`: Database files

### Frontend Development

The frontend uses React with the following structure:

- `/src/components`: React components
- `/src/pages`: Page components
- `/src/services`: Service functions for API calls
- `/src/utils`: Utility functions

## Authentication Flow

1. User signs up with username, password, email, and full name
2. Server validates input, hashes password, and stores user in database
3. User can then log in with username and password
4. Server validates credentials and issues a JWT token
5. Client stores token in localStorage
6. Token is included in API requests for authenticated routes

## License

This project is licensed under the MIT License.

## Contributors

- Your Name