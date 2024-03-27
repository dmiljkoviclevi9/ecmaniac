class ValidationError extends Error {
  constructor(errors) {
    let messages = [];
    
    // Handle both array and non-array input for errors
    if (Array.isArray(errors)) {
      errors.forEach((err) => {
        messages.push(`${err.path}: ${err.msg}`);
      });
    } else {
      // Handle a single error message or object
      messages.push(typeof errors === 'string' ? errors : `${errors.path}: ${errors.msg}`);
    }

    super(messages.join("; "));
    this.statusCode = 422;
  }
}

export default ValidationError;