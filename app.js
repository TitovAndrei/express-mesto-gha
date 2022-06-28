const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');
const { isAuthorizen } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/users', isAuthorizen, usersRoutes);
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
