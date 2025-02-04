const yup = require("yup");

const userProfileSchema = yup.object({
  body: yup.object({
    bio: yup
      .string()
      .required()
      .typeError("Invalid Type: Name Must Be A String"),
    linkedInUrl: yup
      .string()
      .url("Please Enter A Valid URL")
      .required("Enter A Valid LinkedIn URL"),
    facebookUrl: yup
      .string()
      .url("Please Enter A Valid URL")
      .required("Enter A Valid Facebook URL"),
    instaUrl: yup
      .string()
      .url("Please Enter A Valid URL")
      .required("Enter A Valid Insta URL"),
  }),
});

module.exports = userProfileSchema;
