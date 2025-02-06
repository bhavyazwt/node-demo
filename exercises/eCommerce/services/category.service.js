const { Category } = require("../models");

/**
 * @description - Create New Category
 * @param {string} name - new category name (Unique)
 **/
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

/**
 * @description - Get All Categories
 **/
async function getCategories(sortingAndPagination) {
  try {
    return await Category.findAll({
      ...sortingAndPagination,
    });
  } catch (err) {
    throw new Error(`Error finding categories: ${err.message}`);
  }
}

module.exports = { addNewCategory, getCategories };
