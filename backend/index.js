const express = require('express');
require('dotenv').config();
const db = require('./db/psql');

const app = express();

// Database
db.sequelize.authenticate()
    .then(() => console.log('Connected to Database'))
    .catch(err => console.log('Database connect Error:', err));

// db.sequelize.sync();

app.get('/', (req, res) => {
    res.send('Hello World');
})

const PORT = process.env.PORT || '8080'
app.listen(PORT, console.log(`Server started on Port ${PORT}`))