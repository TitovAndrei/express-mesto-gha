const { checkToken } = require('../utils/jwt');
const AuthError = require('../errors/AuthError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new AuthError('Авторизуйтесь для доступа');
  }
  const token = auth.replace('Bearer ', '');
  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    return next(new AuthError('Авторизуйтесь для доступа'));
  }
  req.user = payload;
  next();
};
