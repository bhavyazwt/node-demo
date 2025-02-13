const yup = require("yup");

const addProductSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .required("Please, Enter A Valid Name")
      .typeError("Invalid Type: Name Must Be A String"),
    description: yup.string().typeError("Invalid Type: Name Must Be A String"),
    price: yup
      .string()
      .required("A Valid Price Is Required")
      .typeError("Invalid Type: Price Must Be A String"),
    stock: yup
      .string()
      .required("A Valid Stock Number Is Required")
      .typeError("Invalid Type: Category Must Be A String"),
    category_id: yup
      .string()
      .required("A Valid Category ID Is Required")
      .typeError("Invalid Type: Category Must Be A String"),
    image: yup.mixed(),
  }),
});

module.exports = addProductSchema;
