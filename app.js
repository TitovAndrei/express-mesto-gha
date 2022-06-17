const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62a8a3447b5e82be1caa64fa', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', usersRoutes);
app.use('/', cardsRoutes);
app.use('*', (req, res) => {
  res.status(404).send({
    message: 'Страницы не существует',
  });
});

app.listen(PORT, () => {
  console.log(`Огонь все фурычит на порте ${PORT}`);
});
