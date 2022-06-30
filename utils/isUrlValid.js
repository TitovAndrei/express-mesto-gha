const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

module.exports.isUrlValid = (url) => {
  if (!validator.isURL(url)) {
    throw new BadRequestError('Некорректная ссылка');
  }
  return url;
};
