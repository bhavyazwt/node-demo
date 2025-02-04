const { addProduct } = require("../services/product.service");

async function addNewProduct(req, res) {
  try {
    const { name, description, price, stock, category_id } = req?.body;
    const { productImage } = req?.file;
    const isProductAdded = await addProduct(
      name,
      description,
      price,
      stock,
      category_id,
      productImage
    );

    if (isProductAdded) {
      res.status(200).json({ message: "Product Added Successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
}

module.exports = {
  addNewProduct,
};
