const { roles } = require("../../../constants");

function roleValidator(role) {
  if (roles.includes(role)) return true;
  else return false;
}

module.exports = roleValidator;
