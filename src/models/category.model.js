const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
