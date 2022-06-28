const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const NoteFoundsError = require('./errors/NoteFoundsError');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).send({
    message: 'Страницы не существует',
  });
});

app.listen(PORT, () => {
  console.log(`Огонь! Все фурычит на порте ${PORT}`);
});
