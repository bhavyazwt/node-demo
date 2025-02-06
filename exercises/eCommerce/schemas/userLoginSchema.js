const yup = require("yup");

const userLoginSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .email("Please Enter A Valid Mail")
      .required("A Valid Email Is Required")
      .typeError("Invalid Type: Email Must Be A String"),
    password: yup
      .string()
      .required("A Valid Password Is Required")
      .typeError("Invalid Type: Password Must Be A String"),
  }),
});

module.exports = userLoginSchema;
