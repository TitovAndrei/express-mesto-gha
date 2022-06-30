const { checkToken } = require('../utils/jwt');
const { ERROR_CODE_BAD_AUTH, ERROR_CODE_DEFAULT } = require('../utils/constants');
const AuthError = require('../errors/AuthError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new AuthError();
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    if (!payload) {
      throw new AuthError();
    }
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'AuthError') {
      return res.status(ERROR_CODE_BAD_AUTH).send({ message: 'Авторизуйтесь для доступа' });
    }
    return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
  }
};
