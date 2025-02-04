const yup = require("yup");

const createUserSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .required("Please, Enter A Valid Name")
      .typeError("Invalid Type: Name Must Be A String"),
    email: yup
      .string()
      .email("Please Enter A Valid Mail")
      .required("A Valid Email Is Required")
      .typeError("Invalid Type: Email Must Be A String"),
    age: yup
      .number()
      .min(1, "Please Enter A Valid Age")
      .max(120)
      .required("A Valid Age Is Required")
      .typeError("Age Must Be A Number"),
    role: yup
      .string()
      .oneOf(["Admin", "User"], "Role must be either Admin or User")
      .required("Role is required"),
    isActive: yup
      .boolean()
      .strict()
      .required("Please Enter Valid Active Status")
      .typeError("Enter Valid Active Status in Boolean TRUE OR FALSE"),
  }),
});

module.exports = createUserSchema;
