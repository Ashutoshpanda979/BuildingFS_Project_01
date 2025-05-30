# Node.js Authentication Project Setup

This is a Node.js project for authentication with Express and MongoDB.

## Project Structure
`
BuildingFSProject_01/
├── controller/
├── model/
├── routes/
├── utils/
├── .env
├── .env.sample
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
`

## Setup Instructions

1. Clone the repository:
`ash
git clone https://github.com/Ashutoshpanda979/BuildingFS_Project_01.git
cd BuildingFS_Project_01
`

2. Install dependencies:
`ash
npm install
`

3. Create environment files:
   - Create .env file with the following variables:
   `
   PORT = 3000
   MONGO_URL = your_mongodb_connection_string
   BASE_URL = http://127.0.0.1:3000
   `
   - Create .env.sample as a template (without actual values)

4. Set up .gitignore:
`
.env
.env.sample
`

## Dependencies

### Main Dependencies
- express: ^5.1.0
- mongoose: ^8.15.0
- mongodb: ^6.16.0
- cors: ^2.8.5
- dotenv: ^16.5.0

### Dev Dependencies
- nodemon: ^3.1.10

## Running the Application

Development mode with auto-reload:
`ash
npm run dev
`

## Project Structure Details

- controller/: Contains route controllers
- model/: Database models
- outes/: API route definitions
- utils/: Utility functions and helpers
- index.js: Application entry point
