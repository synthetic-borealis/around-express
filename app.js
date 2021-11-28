const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

const sendNotFoundMessage = (req, res, next) => {
  res.status(404).send({ message: 'Requested resource not found' });
  next();
};

app.use(helmet());
app.use('/users', users);
app.use('/cards', cards);
app.use(sendNotFoundMessage);

app.listen(PORT, () => {});
