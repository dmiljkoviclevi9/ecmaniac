class ValidationError extends Error {
    constructor(errors) {
      let messages = [];
  
      if (errors.length > 0) {
        errors.forEach((err) => {
          messages.push(`${err.path}: ${err.msg}`);
        });
      }
      super(messages.join("; "));
      this.statusCode = 422;
    }
  }
  
  export default ValidationError;