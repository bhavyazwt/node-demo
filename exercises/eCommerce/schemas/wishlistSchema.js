const yup = require("yup");

const wishlistSchema = yup.object({
  body: yup.object({
    productId: yup
      .number()
      .required()
      .typeError("Invalid Type: ProductId Must Be A Number"),
  }),
});

module.exports = wishlistSchema;
