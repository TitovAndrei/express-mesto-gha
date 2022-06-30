class DuplicateErrorCode extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateErrorCode';
    this.statusCode = 409;
  }
}

module.exports = DuplicateErrorCode;
