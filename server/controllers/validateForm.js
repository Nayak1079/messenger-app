// Importing Yup, a library used for schema validation
const Yup = require("yup");

// Defining a schema for form validation using Yup
// This ensures the data structure and constraints are validated
const formSchema = Yup.object({
  username: Yup.string() // Username must be a string
    .required("Username required") // Validation: Username is mandatory
    .min(6, "Username too short") // Validation: Minimum length of 6 characters
    .max(28, "Username too long!"), // Validation: Maximum length of 28 characters
  password: Yup.string() // Password must be a string
    .required("Password required") // Validation: Password is mandatory
    .min(6, "Password too short") // Validation: Minimum length of 6 characters
    .max(28, "Password too long!"), // Validation: Maximum length of 28 characters
});

// Middleware function to validate the form data
const validateForm = (req, res, next) => {
  const formData = req.body; // Extracting form data from the request body

  // Validating the form data using the Yup schema
  formSchema
    .validate(formData)
    .catch(() => {
      // If validation fails, respond with a 422 Unprocessable Entity status
      res.status(422).send();
    })
    .then(valid => {
      if (valid) {
        // If validation succeeds, log a message and proceed to the next middleware
        console.log("form is good");
        next();
      } else {
        // In case the validation fails but no error is caught
        res.status(422).send();
      }
    });
};

// Exporting the validation middleware to be used in other parts of the application
module.exports = validateForm;
