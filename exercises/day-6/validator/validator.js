function validate(schema) {
  return async function (req, res, next) {
    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        { abortEarly: false }
      );
      return next();
    } catch (err) {
      return res.status(500).json({ error: err.errors });
    }
  };
}

module.exports = { validate };
