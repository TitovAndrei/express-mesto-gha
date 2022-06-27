const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret';
const creatureToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7 day' });
const checkToken = (token) => jwt.verify(token, SECRET_KEY);

module.exports = { creatureToken, checkToken };
