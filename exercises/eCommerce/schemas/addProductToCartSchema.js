const yup = require("yup");

const addProductToCartSchema = yup.object({
  body: yup.object({
    productId: yup
      .number()
      .required("Please, Enter A Valid Product ID")
      .typeError("Invalid Type: Product Id Must Be A String"),
    quantity: yup
      .number()
      .required("Please, Enter Quantity")
      .typeError("Invalid Type: Quantity Must Be A Number"),
  }),
});

module.exports = addProductToCartSchema;
