require("dotenv").config();
const loggerMiddleWare = require("./middlewares/logger");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");

app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleWare);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.get("/status", (req, res) => {
  res.send("API RUNNING!");
});

app.listen(PORT, async () => {
  await sequelize.sync({ force: true });
  console.log("Database Connected!");
  console.log(`Server running on port ${PORT}`);
});
