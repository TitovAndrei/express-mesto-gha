const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const creatureToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7 day' });
const checkToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { creatureToken, checkToken };
