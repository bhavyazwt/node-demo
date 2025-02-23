const {
  addNewCategory,
  getCategories,
  getCategoriesByNameFromDB,
} = require("../services/category.service");

const { getPaginationAndSorting } = require("../utility/sortingAndPagination");

/**
 *  @description Create New Category. - [Only Admins]
 **/
async function createCategory(req, res) {
  try {
    const { name, imageUrl } = req?.body;
    const isCategoryAdded = await addNewCategory(name, imageUrl);
    if (isCategoryAdded) {
      res.status(201).json({
        message: "Category Added Successufully",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 *  @description Fetch All Categories. - [PUBLIC]
 **/
async function getAllCategories(req, res) {
  const sortingAndPagination = getPaginationAndSorting(req.query);
  try {
    const categories = await getCategories(null, sortingAndPagination);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createCategory, getAllCategories };
