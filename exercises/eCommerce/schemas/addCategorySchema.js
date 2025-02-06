const yup = require("yup");

const addCategorySchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .required("A Valid Category Is Required")
      .typeError("Invalid Type: Category Must Be A String"),
  }),
});

module.exports = addCategorySchema;
