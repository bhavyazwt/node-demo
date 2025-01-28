// const { users } = require("../constants");
const { getConnection } = require("../db/db");

async function idValidator(req, res, next) {
  const id = req?.params?.id;
  try {
    const connection = await getConnection();
    const [user] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      id
    );
    if (!user.length) return res.status(404).json({ error: "User Not Found" });
    else next();
  } catch (err) {
    return res.status(500).json({ error: err.sqlMessage });
  }
}

module.exports = idValidator;
