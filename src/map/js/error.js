let errors = [];

class ErrorMonitor {
  constructor(){}

  getErrors(){
    return errors;
  }

  setErrors(value){
    errors.push(value);
  }

  clearErrors(){
    errors = [];
  }
}

export default ErrorMonitor;