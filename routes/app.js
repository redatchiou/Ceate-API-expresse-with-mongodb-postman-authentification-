const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const User = require("../model/user");
const Product = require("../model/product");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
// Register route
router.post("/register", async (req, res) => {
  try {

    const { email, first_name, last_name, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/products", verifyToken, async (req, res) => {
  try {

    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/product/:name", verifyToken, async (req, res) => {
  try {
    const { name } = req.params;
    // Retrieve the product by name
    const product = await Product.findOne({ name });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/product", verifyToken, async (req, res) => {
  try {
    const { name, detail, price, hero, image } = req.body;

    const product = new Product({
      name,
      detail,
      price,
      hero,
      image,
    });
    await product.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/product/:name",/*verifyToken , */ async (req, res) => {
  try {
    const { name } = req.params;
    const { detail, price, hero, image } = req.body;


    const product = await Product.findOneAndUpdate(
      { name },
      { detail, price, hero, image },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/product/:name", /*verifyToken , */ async (req, res) => {
  try {
    const { name } = req.params;


    const product = await Product.findOneAndDelete({ name });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
