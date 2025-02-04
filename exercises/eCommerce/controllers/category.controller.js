const {
  addNewCategory,
  getCategories,
} = require("../services/category.service");

async function createCategory(req, res) {
  try {
    const { name } = req?.body;
    const isCategoryAdded = await addNewCategory(name);
    if (isCategoryAdded) {
      res.status(201).json({
        message: "Category Added Successufully",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createCategory, getAllCategories };
