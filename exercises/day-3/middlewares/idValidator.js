const { users } = require("../constants");

function idValidator(req, res, next) {
  const id = req?.params?.id;
  let isValidId = false;
  users.forEach((user) => {
    if (String(user.id) === id) {
      isValidId = true;
    }
  });
  if (isValidId) next();
  else res.status(404).json({ error: "User Not Found" });
}

module.exports = idValidator;
