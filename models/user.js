const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введенный Вами адрес электронной почты не соответствует необходимому формату.',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Введенная ссылка не соответствует необходимому формату.',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

module.exports = mongoose.model('user', userSchema);
