const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./db/psql');

const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.WEB_URL);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database
db.sequelize.authenticate()
    .then(() => console.log('Connected to Database'))
    .catch(err => console.log('Database connect Error:', err));

// db.sequelize.sync({ force: true });

// Routes
app.use('/auth', require('./routes/auth.route'));
app.use('/user', require('./routes/user.route'));
app.use('/category', require('./routes/category.route'));
app.use('/drink', require('./routes/drink.route'));
app.use('/payment', require('./routes/payment.route'));
app.use('/credit', require('./routes/credit.route'));
app.use('/plot', require('./routes/plot.route'));

const PORT = process.env.PORT || '8080';
app.listen(PORT, console.log(`Server started on Port ${PORT}`));