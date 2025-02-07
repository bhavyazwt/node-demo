const {
  addProduct,
  getProductsFromDB,
  updateProduct,
  deleteProductFromDB,
  deleteImageFromStorage,
} = require("../services/product.service");
const path = require("path");
const { getPaginationAndSorting } = require("../utility/sortingAndPagination");
const { getCategories } = require("../services/category.service");

async function addNewProduct(req, res) {
  let imgPath;
  try {
    const { name, description, price, stock, category_id, fileName } =
      req?.body;

    if (fileName) {
      //Storing Path To Delete In Case of Error
      imgPath = path.join(__dirname, "../tmp/uploads/img", fileName);
    }

    const category = await getCategories(category_id);
    if (!category.length) {
      if (imgPath) deleteImageFromStorage(imgPath);
      return res
        .status(404)
        .json({ error: "Category Doesn't exists! Add a valid category" });
    }

    const isProductAdded = await addProduct(
      name,
      description,
      price,
      stock,
      category_id,
      imgPath
    );

    if (isProductAdded) {
      const newProduct = await getProductsFromDB(isProductAdded.id);
      res
        .status(201)
        .json({ message: "Product Added Successfully", data: newProduct });
    }
  } catch (err) {
    if (imgPath) deleteImageFromStorage(imgPath);
    return res.status(500).json({ error: err });
  }
}

//Get All Products
async function getProducts(req, res) {
  try {
    const sortingAndPagination = getPaginationAndSorting(req.query);
    const products = await getProductsFromDB(null, sortingAndPagination);

    if (products) {
      return res.status(200).json({
        message: products?.length
          ? "Product Found Successfully"
          : "No Products Found",
        data: products,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
}

//Get Individual Product by ID
async function getProductsById(req, res) {
  try {
    const id = req.params.id;
    const product = await getProductsFromDB(id);
    if (product) {
      res
        .status(200)
        .json({ message: "Product Found Successfully!", data: product });
    }
  } catch (err) {
    res.status(500).json({ message: `Error Finding Product, ${err.message}` });
  }
}

//Update Product
async function updateProducts(req, res) {
  try {
    const id = req.params.id;
    const { name, description, price, stock, category_id, fileName } =
      req?.body;

    const category = await getCategories(category_id);
    if (!category.length) {
      return res
        .status(404)
        .json({ error: "Category Doesn't exists! Add a valid category" });
    }
    let imgPath, oldImgPath;

    if (fileName) {
      const oldProduct = await getProductsFromDB(id);
      oldImgPath = oldProduct.image_url;
      imgPath = path.join(__dirname, "../tmp/uploads/img", fileName);
    }
    const updatedProduct = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price }),
      ...(stock && { stock }),
      ...(category_id && { category_id }),
      ...(fileName && { image_url: imgPath }),
    };

    const isUpdated = await updateProduct(id, updatedProduct);
    if (isUpdated) {
      if (oldImgPath) {
        deleteImageFromStorage(oldImgPath);
      }
      const product = await getProductsFromDB(id);
      return res
        .status(200)
        .json({ message: "Product Updated Successfully.", data: product });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: `Error Updating Product, ${err.message} ` });
  }
}

// Delete Product
async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    let imgPath;
    const product = getProductsFromDB(id);
    if (product.image_url) {
      imgPath = product.image_url;
    }
    const isDeleted = await deleteProductFromDB(id);
    if (isDeleted) {
      if (imgPath) deleteImageFromStorage(imgPath);
      res.status(200).json({ message: "Product Deleted Successfully" });
    } else {
      throw new Error("Product Doesn't exist");
    }
  } catch (err) {
    res.status(500).json({ error: `Something Went Wrong,${err.message}` });
  }
}

module.exports = {
  addNewProduct,
  getProducts,
  getProductsById,
  updateProducts,
  deleteProduct,
};
