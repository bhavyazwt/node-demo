const { roles } = require("../constants");

function roleValidator(role) {
  if (roles.include(role)) return true;
  else return false;
}

module.exports = roleValidator;
