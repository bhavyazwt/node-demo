const {
  addProduct,
  getProductsFromDB,
  updateProduct,
  deleteProductFromDB,
  deleteImageFromStorage,
  getProductByCategoriesFromDB,
  searchProductByName,
} = require("../services/product.service");
const path = require("path");
const { getPaginationAndSorting } = require("../utility/sortingAndPagination");
const { getCategories } = require("../services/category.service");

async function addNewProduct(req, res) {
  let imgPath;
  try {
    const { name, description, price, stock, category_id, imageUrl } =
      req?.body;
    imgPath = imageUrl;
    const category = await getCategories(category_id);
    console.log(category);
    if (!category.length) {
      if (imageUrl) {
        const publicId = extractPath(imgPath);
        deleteImageFromStorage(publicId);
        console.log(publicId);
      }
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
      imageUrl
    );

    if (isProductAdded) {
      const newProduct = await getProductsFromDB(isProductAdded.id);
      res
        .status(201)
        .json({ message: "Product Added Successfully", data: newProduct });
    }
  } catch (err) {
    if (imgPath) {
      console.log(err);
      const publicId = extractPath(imgPath);
      deleteImageFromStorage(publicId);
    }
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

function extractPath(url) {
  const match = url.match(/\/(uploads\/image-[^/.]+)/);
  return match ? match[1] : null;
}
//Update Product
async function updateProducts(req, res) {
  try {
    const id = req.params.id;
    const { name, description, price, stock, category_id, imageUrl } =
      req?.body;

    const category = await getCategories(category_id);
    if (!category.length) {
      return res
        .status(404)
        .json({ error: "Category Doesn't exists! Add a valid category" });
    }
    let oldImgPath;

    if (imageUrl) {
      const oldProduct = await getProductsFromDB(id);
      oldImgPath = oldProduct.image_url;
    }
    const updatedProduct = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price }),
      ...(stock && { stock }),
      ...(category_id && { category_id }),
      ...(imageUrl && { image_url: imageUrl }),
    };

    const isUpdated = await updateProduct(id, updatedProduct);
    if (isUpdated) {
      if (oldImgPath) {
        const publicId = extractPath(oldImgPath);
        deleteImageFromStorage(publicId);
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
    const product = await getProductsFromDB(id);
    console.log(product);
    const isDeleted = await deleteProductFromDB(id);
    if (isDeleted) {
      {
        const publicId = extractPath(product[0].image_url);
        deleteImageFromStorage(publicId);
      }
      res.status(200).json({ message: "Product Deleted Successfully" });
    } else {
      throw new Error("Product Doesn't exist");
    }
  } catch (err) {
    res.status(500).json({ error: `Something Went Wrong,${err.message}` });
  }
}

async function getProductByCategories(req, res) {
  const name = req?.params.name;
  const sortingAndPagination = getPaginationAndSorting(req.query);
  try {
    const categories = await getProductByCategoriesFromDB(
      name,
      sortingAndPagination
    );
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function searchProduct(req, res) {
  const name = req?.query.search;
  console.log("name", name);
  const sortingAndPagination = getPaginationAndSorting(req.query);
  try {
    const products = await searchProductByName(name, sortingAndPagination);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  addNewProduct,
  getProducts,
  getProductsById,
  updateProducts,
  deleteProduct,
  getProductByCategories,
  searchProduct,
};
