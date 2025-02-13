require("dotenv").config();
const loggerMiddleWare = require("./middlewares/logger");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const categoryRoutes = require("./routes/category.route");
const productRoutes = require("./routes/product.route");
const cartRoutes = require("./routes/cart.route");
const wishlistRoutes = require("./routes/wishlist.route");
const orderRoutes = require("./routes/order.route");

app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleWare);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/order", orderRoutes);

app.get("/status", (req, res) => {
  res.send("API RUNNING!");
});

app.use(cors());

app.listen(PORT, async () => {
  await sequelize.sync();
  console.log("Database Connected!");
  console.log(`Server running on port ${PORT}`);
});
