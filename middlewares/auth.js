const { checkToken } = require('../utils/jwt');
const { ERROR_CODE_BAD_AUTH } = require('../utils/constants');
const AuthError = require('../errors/AuthError');

// eslint-disable-next-line consistent-return
const isAuthorizen = (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    if (!payload) {
      throw new AuthError();
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(ERROR_CODE_BAD_AUTH).send({ message: 'Авторизуйтесь для доступа' });
  }
};

module.exports = { isAuthorizen };
