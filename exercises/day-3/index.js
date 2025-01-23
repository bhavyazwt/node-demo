require("dotenv").config();
const loggerMiddleWare = require("./middlewares/logger");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

const apiRoutes = require("./routes/api");

app.use(express.json());
app.use(loggerMiddleWare);
app.use("/", apiRoutes);

app.get("/status", (req, res) => {
  res.send("API RUNNING!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
