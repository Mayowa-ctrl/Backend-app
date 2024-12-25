const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const conncectDB = require('./config/connectDB');



// Initializing express
const app = express();

// load environment variable 
dotenv.config({path: ".env"});

// Connect to database
conncectDB();

// Body parser
app.use(express.json()); 

// mount routes
const auth = require('./routes/auth');
const blog = require('./routes/blog')

app.use('/api/v1/auth', auth);
app.use('/api/v1/blog', blog)

const PORT = 5000;

const server = app.listen(PORT, 
    console.log(`Server running on ${PORT}`.yellow.bold)
)