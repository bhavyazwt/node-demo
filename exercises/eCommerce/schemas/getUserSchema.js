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
    sort: yup
      .string()
      .oneOf(
        ["age", "createdAt", "updatedAt", "name"],
        "Sort should be from age, createdAt, updatedAt,name"
      ),
    sortType: yup
      .string()
      .oneOf(
        ["ASC", "DESC"],
        "Invalid Sort Type, Only ASC And DSC are allowed"
      ),
  }),
});

module.exports = getUserSchema;
