const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./db/psql');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database
db.sequelize.authenticate()
    .then(() => console.log('Connected to Database'))
    .catch(err => console.log('Database connect Error:', err));

// db.sequelize.sync();

// Routes
app.use('/auth', require('./routes/auth.route'));
app.use('/user', require('./routes/user.route'));

const PORT = process.env.PORT || '8080'
app.listen(PORT, console.log(`Server started on Port ${PORT}`))