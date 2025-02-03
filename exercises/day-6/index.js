require("dotenv").config();
const loggerMiddleWare = require("./middlewares/logger");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

const apiRoutes = require("./routes/api");

app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleWare);
app.use("/", apiRoutes);

app.get("/status", (req, res) => {
  res.send("API RUNNING!");
});

app.listen(PORT, async () => {
  await sequelize.sync();
  console.log("Database Connected!");
  console.log(`Server running on port ${PORT}`);
});
