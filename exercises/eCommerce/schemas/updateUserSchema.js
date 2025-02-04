const yup = require("yup");

const updateUserSchema = yup.object({
  body: yup.object({
    name: yup.string().typeError("Invalid Type: Name Must Be A String"),
    email: yup
      .string()
      .email("Please Enter A Valid Mail")
      .typeError("Invalid Type: Email Must Be A String"),
    age: yup.number().min(1).max(120).typeError("Age Must Be A Number"),
    role: yup
      .string()
      .oneOf(["Admin", "User"], "Role must be either Admin or User"),
    isActive: yup
      .boolean()
      .strict()
      .typeError("Enter Valid Active Status in Boolean TRUE OR FALSE"),
  }),
});

module.exports = updateUserSchema;
