const express = require("express");
const {getCategories} = require("./controller.js");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);