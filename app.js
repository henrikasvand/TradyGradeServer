require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/marketplace/items', itemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

module.exports = app;
