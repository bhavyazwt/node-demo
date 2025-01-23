function ageValidator(age) {
  if (typeof age === "number" && age > 0 && age < 150) {
    return true;
  } else {
    return false;
  }
}

module.exports = ageValidator;
