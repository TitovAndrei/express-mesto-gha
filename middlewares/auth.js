const { checkToken } = require('../utils/jwt');

// eslint-disable-next-line consistent-return
const isAuthorizen = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).send({ message: 'Авторизуйтесь для доступа' });
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    if (!token) {
      return res.status(401).send({ message: 'Авторизуйтесь для доступа' });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Авторизуйтесь для доступа' });
  }
};

module.exports = { isAuthorizen };
