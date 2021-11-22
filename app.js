const express = require('express');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

const sendNotFoundMessage = (req, res, next) => {
  res.status(404).send({ message: 'Requested resource not found' });
  next();
};

app.use('/users', users);
app.use('/cards', cards);
app.use(sendNotFoundMessage);

app.listen(PORT, () => {});
