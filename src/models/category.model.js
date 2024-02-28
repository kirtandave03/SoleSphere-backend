const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

categorySchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
