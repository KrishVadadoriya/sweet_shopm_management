# Sweet Shop Management System

A comprehensive Sweet Shop Management System built using the MERN Stack (MongoDB, Express, React, Node.js) following Test-Driven Development (TDD) principles.

## Features

- **Add Sweet**: Add new sweets with name, category, price, and quantity
- **Delete Sweet**: Remove sweets from inventory
- **View Sweets**: Browse all sweets in a visually appealing interface
- **Search & Filter**: Find sweets by name, category, or price range
- **Purchase Sweet**: Reduce stock when items are purchased
- **Restock Sweet**: Increase inventory levels
- **Sort Sweets**: Organize by price, quantity, or alphabetically

## Tech Stack

- **MongoDB**: NoSQL database for storing sweet information
- **Express.js**: Backend framework for handling API requests
- **React.js**: Frontend library for building the user interface
- **Node.js**: JavaScript runtime environment
- **Jest & Supertest**: Testing frameworks for TDD
- **Mongoose**: MongoDB object modeling tool
- **React Router**: For frontend routing
- **Axios**: For API requests

## Project Structure

```
├── backend/                # Backend code
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── tests/         # Backend tests
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Entry point
│
└── src/                   # Frontend code
    ├── assets/            # CSS and other static files
    ├── components/        # Reusable React components
    ├── pages/             # Page components
    ├── services/          # API service functions
    ├── tests/             # Frontend tests
    ├── App.js             # Main React component
    └── index.js           # React entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd sweet_shop_management
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd backend
   npm install
   ```

4. Configure environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/sweet_shop
     NODE_ENV=development
     ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server (in a new terminal)
   ```
   npm start
   ```

3. Access the application at `http://localhost:3000`

## API Endpoints

| Method | Endpoint                | Description                |
|--------|-------------------------|----------------------------|
| POST   | /sweets                 | Add new sweet              |
| GET    | /sweets                 | List all sweets            |
| GET    | /sweets/:id             | Get sweet by ID            |
| GET    | /sweets/search          | Search sweets              |
| DELETE | /sweets/:id             | Delete sweet               |
| POST   | /sweets/:id/purchase    | Purchase sweet             |
| POST   | /sweets/:id/restock     | Restock sweet              |

### Sample API Requests

#### Add a new sweet
```json
POST /sweets
{
  "name": "Chocolate Truffle",
  "category": "Chocolate",
  "price": 25.99,
  "quantity": 100
}
```

#### Search sweets
```
GET /sweets/search?name=Chocolate&minPrice=10&maxPrice=30
```

#### Purchase a sweet
```json
POST /sweets/:id/purchase
{
  "quantity": 5
}
```

## Running Tests

### Backend Tests

```
cd backend
npm test
```

### Frontend Tests (if implemented)

```
npm test
```

## TDD Approach

This project follows Test-Driven Development principles:

1. Write tests first
2. Run tests (they should fail)
3. Write implementation code
4. Run tests again (they should pass)
5. Refactor code as needed

Each feature was developed following this cycle, ensuring high test coverage and robust functionality.

## License

MIT
