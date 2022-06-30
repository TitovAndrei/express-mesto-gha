const { checkToken } = require('../utils/jwt');
const AuthError = require('../errors/AuthError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new AuthError('Авторизуйтесь для доступа');
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    if (!payload) {
      throw new AuthError('Авторизуйтесь для доступа');
    }
    req.user = payload;
    next();
  } catch (err) {
    return next();
  }
};
