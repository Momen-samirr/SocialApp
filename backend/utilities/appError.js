class appError extends Error {
  constructor(message, statusCode, statusText) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

export default appError;
