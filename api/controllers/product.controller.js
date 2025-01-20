import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.role === "seller") {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (
    !req.body.title ||
    !req.body.content ||
    !req.body.price ||
    !req.body.previousprice ||
    !req.body.stock ||
    !req.body.companyname
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug =
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const newProduct = new Product({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export const getproducts = async (req, res, next) => {
  try {
    if (req.query.productId) {
      const product = await Product.findById(req.query.productId);
      if (!product) {
        return next(errorHandler(404, "Product not found"));
      }
      return res.status(200).json({ product });
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const products = await Product.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { companyname: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthProducts = await Product.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      products,
      totalProducts,
      lastMonthProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteproduct = async (req, res, next) => {
  try {
    if (!req.user.role === "seller" || req.user.id !== req.params.userId) {
      return next(
        errorHandler(403, "You are not allowed to delete this product")
      );
    }
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
    if (!deletedProduct) {
      return next(errorHandler(404, "Product not found"));
    }
    res.status(200).json({ message: "The product has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateproduct = async (req, res, next) => {
  if (!req.user.role === "seller" || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          companyname: req.body.companyname,
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          previousprice: req.body.previousprice,
          price: req.body.price,
          stock: req.body.stock,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
