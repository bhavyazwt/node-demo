// const { users } = require("../constants");

async function idValidator(req, res, next) {
  const id = req?.params?.id ?? req?.params?.userId;
  try {
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", id);
    if (!user.length) return res.status(404).json({ error: "User Not Found" });
    else next();
  } catch (err) {
    return res.status(500).json({ error: err.sqlMessage });
  }
}

module.exports = idValidator;
