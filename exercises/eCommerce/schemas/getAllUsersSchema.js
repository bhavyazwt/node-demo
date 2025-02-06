const yup = require("yup");

const getAllUsers = yup.object({
  query: yup.object({
    role: yup
      .string()
      .oneOf(
        ["admin", "customer"],
        "Role must be either admin or customer (Case-Sensitive)"
      ),
    limit: yup.number().typeError("Limit must be a valid number"),
    page: yup.number().typeError("Page must be a valid number"),
    sort: yup
      .string()
      .oneOf(
        ["id", "first_name", "last_name", "createdAt"],
        "Sort should be from Price, Stock, Quantity"
      ),
    sortType: yup
      .string()
      .oneOf(
        ["ASC", "DESC"],
        "Invalid Sort Type, Only ASC And DSC are allowed"
      ),
  }),
});

module.exports = getAllUsers;
