const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const Product = require("../models/product.model");

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

    const deletedProduct = await product.delete();

    return res
      .status(200)
      .json(new apiResponse(deletedProduct, "Product deleted successfully"));
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

    const iscategory = await Category.findById(category);
    const isBrand = await Brand.findById(brand);

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
    const { product_id, variants } = req.body;
    const { color } = variants;

    const existedProduct = await Product.findById(product_id);

    if (!existedProduct) {
      throw new apiError(404, "Product not found");
    }

    const index = existedProduct.variants.findIndex(
      (item) => item.color === color
    );

    if (index !== -1) {
      throw new apiError(400, "Variant already exists");
    }

    const newVariant = [...existedProduct.variants];
    newVariant.push(variants);

    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
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
}
module.exports = AdminService;
