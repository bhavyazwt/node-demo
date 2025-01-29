const yup = require("yup");

const getUserSchema = yup.object({
  query: yup.object({
    ageGt: yup
      .string()
      .matches(
        /^[0-9]*[1-9][0-9]*$/,
        "Age Must Be A Positive Integer, 0 is Not Allowed"
      ),
    role: yup
      .string()
      .oneOf(["Admin", "User"], "Role must be either Admin or User"),
    isActive: yup
      .boolean()
      .typeError("Enter Valid Active Status in Boolean TRUE OR FALSE"),
  }),
});

module.exports = getUserSchema;
