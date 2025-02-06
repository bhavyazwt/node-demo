const yup = require("yup");

const updateProductSchema = yup.object({
  body: yup.object({
    name: yup.string().typeError("Invalid Type: Name Must Be A String"),
    description: yup.string().typeError("Invalid Type: Name Must Be A String"),
    price: yup.string().typeError("Invalid Type: Price Must Be A String"),
    stock: yup.string().typeError("Invalid Type: Password Must Be A String"),
    category_id: yup
      .string()
      .typeError("Invalid Type: Password Must Be A String"),
    productImage: yup.mixed(),
  }),
});

module.exports = updateProductSchema;
