const yup = require("yup");

const addCategorySchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .email("Please Enter A Valid Category")
      .required("A Valid Category Is Required")
      .typeError("Invalid Type: Category Must Be A String"),
  }),
});

module.exports = addCategorySchema;
