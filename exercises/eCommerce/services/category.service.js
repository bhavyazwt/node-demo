const { Category } = require("../models");

async function addNewCategory(name) {
  try {
    return await Category.create({ name });
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      throw new Error(`Category Already Exists!`);
    }
    throw new Error(`Error creating category: ${err.message}`);
  }
}

async function getCategories() {
  try {
    return await Category.findAll();
  } catch (err) {
    throw new Error(`Error finding categories: ${err.message}`);
  }
}

module.exports = { addNewCategory, getCategories };
