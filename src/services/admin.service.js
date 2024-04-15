const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
const Order = require("../models/order.model");

class AdminService {
  constructor() {}

  getAllUsers = async (req, res) => {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 5;
    const deleted = Boolean(req.query.deleted) || false;

    const { q } = req.query;

    const totalCount = (await User.find()).length;
    const totalDeletedUsers = await User.findDeleted({ deleted: true });
    const totalDeletedCount = totalDeletedUsers.length;

    if (deleted) {
      if (!q) {
        const deletedUsers = await User.findDeleted({ deleted: true })
          .select("username email profilePic phone address")
          .skip(page * limit)
          .limit(limit);
        return res
          .status(200)
          .json(
            new apiResponse(
              { deletedUsers, totalDeletedCount },
              "Deleted Users"
            )
          );
      } else {
        const deletedUsers = await User.findDeleted({
          $and: [
            { deleted: true },
            {
              $or: [
                { email: { $regex: q, $options: "i" } },
                { phone: { $regex: q, $options: "i" } },
                { username: { $regex: q, $options: "i" } },
              ],
            },
          ],
        })
          .select("username email profilePic phone address")
          .skip(page * limit)
          .limit(limit);

        return res
          .status(200)
          .json(
            new apiResponse(
              { deletedUsers, totalDeletedCount: totalDeletedCount },
              "Deleted Users"
            )
          );
      }
    }
    if (!q) {
      const users = await User.find()
        .select("username email profilePic phone address")
        .skip(page * limit)
        .limit(limit);

      res
        .status(200)
        .json(
          new apiResponse(
            { users, totalCount },
            "All users fetched successfully"
          )
        );
    } else {
      const users = await User.find({
        $or: [
          { email: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
          { username: { $regex: q, $options: "i" } },
        ],
      })
        .select("username email profilePic phone address")
        .skip(page * limit)
        .limit(limit);

      res
        .status(200)
        .json(
          new apiResponse(
            { users, totalCount },
            "All users fetched successfully"
          )
        );
    }
  };

  deleteUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params._id });

    if (!user) {
      throw new apiError(404, "User not found");
    }

    // Soft delete the user
    const deletedUser = await user.delete();

    return res
      .status(200)
      .json(new apiResponse(deletedUser, "User Deleted successfully"));
  };

  restoreUser = async (req, res) => {
    const { _id } = req.params;
    const deletedUser = await User.findDeleted({
      $and: [{ deleted: true }, { _id: _id }],
    });

    if (!deletedUser.length) {
      throw new apiError(404, "User not found");
    }

    deletedUser[0].deleted = false;
    const restoredUser = await deletedUser[0].save();
    return res
      .status(200)
      .json(new apiResponse(restoredUser, "User Restored Successfully"));
  };

  deleteProduct = async (req, res) => {
    const { productName } = req.params;

    const product = await Product.findOne({
      productName: productName.toLowerCase(),
    });

    if (!product) {
      throw new apiError(404, "Product not found");
    }

    const deletedProducts = await product.delete();

    if (!deletedProducts) {
      throw new apiError(500, "Internal Server Error");
    }

    return res
      .status(200)
      .json(new apiResponse(deletedProducts, "Product deleted successfully"));
  };

  restoreProduct = async (req, res) => {
    const { _id } = req.params;
    const deletedProduct = await Product.findDeleted({
      $and: [{ deleted: true }, { _id: _id }],
    });

    if (!deletedProduct.length) {
      throw new apiError(404, "Product not found");
    }

    deletedProduct[0].deleted = false;
    const restoredProduct = await deletedProduct[0].save();

    if (!deletedProduct) {
      throw new apiError(500, "Internal Server Error");
    }

    return res
      .status(200)
      .json(new apiResponse(restoredProduct, "Product restored successfully"));
  };

  addProduct = async (req, res) => {
    const {
      productName,
      shortDescription,
      sizeType,
      closureType,
      material,
      longDescription,
      gender,
      category,
      brand,
      variants,
      discount,
      giftPackaging,
      qr,
    } = req.body;

    const isProduct = await Product.findOne({ productName });
    const iscategory = await Category.findById(category);
    const isBrand = await Brand.findById(brand);

    if (isProduct) {
      throw new apiError(400, "Product Already Exists");
    }
    if (!iscategory) {
      throw new apiError(404, "Category not found");
    }

    if (!isBrand) {
      throw new apiError(404, "Brand not found");
    }

    const newProduct = new Product({
      productName,
      shortDescription,
      sizeType,
      variants, // Assign the array of variant objects
      discount,
      closureType,
      material,
      longDescription,
      giftPackaging,
      qr,
      gender,
      review: [],
      category,
      brand,
    });

    const savedProduct = await newProduct.save();

    // Respond with the saved product
    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  };

  addVariant = async (req, res) => {
    const { productName, variants } = req.body;
    const { color } = variants;

    const existedProduct = await Product.findOne({ productName });

    if (!existedProduct) {
      throw new apiError(404, "Product Not Found");
    }

    const index = existedProduct.variants.findIndex(
      (item) => item.color === color
    );

    console.log(index);

    if (index !== -1) {
      throw new apiError(400, "Variant already exists");
    }

    const newVariant = [...existedProduct.variants];
    newVariant.push(variants);

    const updatedProduct = await Product.findOneAndUpdate(
      { productName },
      {
        variants: newVariant,
      },
      { new: true }
    );

    if (!updatedProduct) {
      throw new apiError(500, "Error while adding variant");
    }

    return res
      .status(200)
      .json(new apiResponse(updatedProduct, "Variant added successfully"));
  };

  editProduct = async (req, res) => {
    const {
      productName,
      updatedProductName,
      shortDescription,
      longDescription,
      closureType,
      material,
      gender,
      sizeType,
      category,
      brand,
      variant,
    } = req.body;

    const updateObject = {};
    if (updatedProductName) {
      updateObject.productName = updatedProductName.toLowerCase();
    }
    if (shortDescription) {
      updateObject.shortDescription = shortDescription;
    }
    if (longDescription) {
      updateObject.longDescription = longDescription;
    }
    if (closureType) {
      updateObject.closureType = closureType.toLowerCase();
    }
    if (material) {
      updateObject.material = material.toLowerCase();
    }
    if (gender) {
      updateObject.gender = gender.toLowerCase();
    }
    if (sizeType) {
      updateObject.sizeType = sizeType.toUpperCase();
    }
    if (category) {
      const isCategory = await Category.findOne({ category });

      if (isCategory) {
        updateObject.category = isCategory._id;
      } else {
        throw new apiError(404, "Category not found");
      }
    }
    if (brand) {
      const isBrand = await Brand.findOne({ brand });

      if (isBrand) {
        updateObject.brand = isBrand._id;
      } else {
        throw new apiError(404, "Brand not found");
      }
    }
    if (variant) {
      updateObject.variants = variant;
    }

    const product = await Product.findOneAndUpdate(
      { productName },
      {
        $set: updateObject,
      },
      { new: true }
    );

    if (!product) {
      throw new apiError(404, "Product not found");
    }

    return res
      .status(200)
      .json(new apiResponse(product, "Product Updated Successfully"));
  };

  getAllOrders = async (req, res) => {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;

    const orders = await Order.find()
      .populate({
        path: "user",
        select: "email",
      })
      .skip(page * limit)
      .limit(limit);

    const totalOrders = await Order.find();

    if (!orders) {
      throw new apiError(500, "Internal Server Error");
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          { orders, totalOrders: totalOrders.length },
          "All Orders Fetched Successfully"
        )
      );
  };

  orderDetails = async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
      throw new apiError(400, "orderId in params is required");
    }

    const order = await Order.findById(orderId)
      .populate({
        path: "products.product_id",
        select: "sizeType",
        model: "Product",
      })
      .populate({
        path: "user",
        select: "email",
      });

    if (!order) {
      throw new apiError(404, "Order not found");
    }

    return res
      .status(200)
      .json(new apiResponse(order, "Order fetched successfully"));
  };

  getDashboard = async (req, res) => {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 5;
    const totalActiveUsers = (await User.find()).length;
    const totalOrders = await Order.find();
    const totalPendingOrders = (await Order.find({ orderStatus: "Pending" }))
      .length;

    // Most Sold Product
    const mostSoldProducts = await Order.aggregate([
      [
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product_id", // Group by product ID
            productName: {
              $first: "$products.productName",
            }, // Get the product name
            totalQuantity: {
              $sum: "$products.quantity",
            }, // Calculate total quantity sold
          },
        },

        {
          $limit: 10, // Take the top 10 documents which represents the maximum sold product
        },
        {
          $lookup: {
            from: "products", // Assuming your products collection name is "products"
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            _id: 1,
            productName: 1,
            totalQuantity: 1,
            category: "$product.category",
            brand: "$product.brand",
            image_url: {
              $arrayElemAt: ["$product.variants.image_urls", 0],
            },
          },
        },
        {
          $sort: {
            totalQuantity: -1, // Sort by total quantity in descending order
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $addFields: {
            category: "$category.category",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $addFields: {
            brand: "$brand.brand",
          },
        },
      ],
    ])
      .skip(page * limit)
      .limit(limit);

    // FInding Revenue based on year and month

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          }, // Group by year and month
          totalRevenue: { $sum: { $toDouble: "$totalAmount" } }, // Calculate total revenue for each year and month
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default MongoDB ID
          year: "$_id.year", // Extract year from _id
          month: "$_id.month", // Extract month from _id
          totalRevenue: 1, // Include totalRevenue field
        },
      },
      {
        $sort: {
          year: -1, // Sort by year in ascending order
          month: 1, // Then sort by month in ascending order
        },
      },
      {
        $group: {
          _id: "$year", // Group by year
          monthlyRevenue: {
            $push: { month: "$month", totalRevenue: "$totalRevenue" },
          }, // Push monthly revenue data into an array
          totalYearlyRevenue: { $sum: "$totalRevenue" }, // Calculate total yearly revenue
        },
      },
      {
        $sort: {
          _id: -1, // Sort by year in ascending order
        },
      },
    ]);

    const totalAmount = totalOrders.reduce((acc, curr) => {
      return acc + Number(curr.totalAmount);
    }, 0);

    const totalDiscount = totalOrders.reduce((acc, curr) => {
      return acc + Number(curr.totalDiscount);
    }, 0);

    const totalSales = totalAmount - totalDiscount;

    return res.status(200).json(
      new apiResponse({
        totalActiveUsers,
        totalOrders: totalOrders.length,
        totalPendingOrders,
        totalRevenue,
        totalSales,
        mostSoldProducts,
      })
    );
    // return res.send("hello");
  };
}
module.exports = AdminService;
