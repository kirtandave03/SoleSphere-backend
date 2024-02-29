const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const brandSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    brandIcon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

brandSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
