class NoteFoundsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoteFoundsError';
    this.statusCode = 404;
  }
}

module.exports = NoteFoundsError;
