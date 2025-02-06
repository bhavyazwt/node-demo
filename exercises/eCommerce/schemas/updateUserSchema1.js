const yup = require("yup");

const updateUserSchema = yup.object({
  body: yup.object({
    first_name: yup
      .string()
      .typeError("Invalid Type: First Name Must Be A String"),
    last_name: yup
      .string()
      .typeError("Invalid Type: Last Name Must Be A String"),
    email: yup
      .string()
      .email("Please Enter A Valid Mail")
      .typeError("Invalid Type: Email Must Be A String"),
    password: yup.string().typeError("Invalid Type: Password Must Be A String"),
  }),
});

module.exports = updateUserSchema;
