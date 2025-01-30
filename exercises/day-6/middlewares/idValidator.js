// const { users } = require("../constants");
const { User } = require("../models");
async function idValidator(req, res, next) {
  const id = req?.params?.id ?? req?.params?.userId;
  try {
    const user = await User.findAll({
      where: {
        id,
      },
    });
    if (!user.length)
      return res.status(404).json({ message: "User Not Found" });
    else next();
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

module.exports = idValidator;
