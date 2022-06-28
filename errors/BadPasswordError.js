class BadPasswordError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadPasswordError';
    this.statusCode = 403;
  }
}

module.exports = BadPasswordError;
