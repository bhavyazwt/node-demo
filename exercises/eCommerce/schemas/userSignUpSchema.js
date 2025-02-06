const yup = require("yup");

const userSignupSchema = yup.object({
  body: yup.object({
    first_name: yup
      .string()
      .required("Please, Enter A Valid First Name")
      .typeError("Invalid Type: Name Must Be A String"),
    last_name: yup
      .string()
      .required("Please, Enter A Valid Last Name")
      .typeError("Invalid Type: Name Must Be A String"),
    email: yup
      .string()
      .email("Please Enter A Valid Mail")
      .required("A Valid Email Is Required")
      .typeError("Invalid Type: Email Must Be A String"),
    role: yup
      .string()
      .oneOf(
        ["admin", "customer"],
        "Role must be either admin or customer (Case-Sensitive)"
      )
      .required("Role is required"),
    password: yup
      .string()
      .required("A Valid Password Is Required")
      .typeError("Invalid Type: Password Must Be A String"),
  }),
});

module.exports = userSignupSchema;
