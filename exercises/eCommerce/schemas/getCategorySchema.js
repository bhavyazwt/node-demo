const yup = require("yup");

const getCategorySchema = yup.object({
  query: yup.object({
    limit: yup.number().typeError("Limit must be a valid number"),
    page: yup.number().typeError("Page must be a valid number"),
    sort: yup
      .string()
      .oneOf(
        ["price", "stock", "createdAt"],
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

module.exports = getCategorySchema;
