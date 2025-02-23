const { Category } = require("../models");

/**
 * @description - Create New Category
 * @param {string} name - new category name (Unique)
 * @param {string} image_url - new category image url (Unique)
 *
 **/
async function addNewCategory(name, image_url) {
  try {
    return await Category.create({ name, image_url });
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      throw new Error(`Category Already Exists!`);
    }
    throw new Error(`Error creating category: ${err.message}`);
  }
}

/**
 * @description - Get All Categories
 * @param {string} id - Optional, if not passed will return all categories
 * @param {object} sortingAndPagination - Sorting and Pagination Object
 **/
async function getCategories(id = null, sortingAndPagination = {}) {
  try {
    return await Category.findAll({
      ...(id && { where: { id } }),
      ...sortingAndPagination,
    });
  } catch (err) {
    throw new Error(`Error finding categories: ${err.message}`);
  }
}

module.exports = { addNewCategory, getCategories };
