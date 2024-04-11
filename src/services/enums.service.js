const apiResponse = require("../interfaces/apiResponse");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");

class EnumsService {
  constructor() {}

  getAllEnums = async (req, res) => {
    const sizeType = ["UK", "US", "EU"];
    const closureType = [
      "zipper",
      "button",
      "hook and loop",
      "lace-up",
      "buckle",
      "velcro",
    ];
    const material = [
      "leather",
      "suede",
      "canvas",
      "mesh",
      "rubber",
      "synthetic",
      "textile",
      "knit",
      "velvet",
      "denim",
      "cork",
      "faux leather",
    ];

    const gender = ["male", "female", "unisex"];
    const category = await Category.find().select("category -_id");
    const categories = category.map((cat) => cat.category);
    const brand = await Brand.find().select("brand -_id");
    const brands = brand.map((brand) => brand.brand);

    const colors = [
      "0xFF000000",
      "0xFF860909",
      "0xFF00FF00",
      "0xFFFF00FF",
      "0xFFF1EAEA",
    ];

    const sizes = [5, 6, 7, 8, 9, 10, 11, 12];

    const sort = ["low-to-high", "high-to-low", "review", "latest arrivals"];

    return res.status(200).json(
      new apiResponse(
        {
          closuretype: closureType,
          material,
          gender,
          category: categories,
          brand: brands,
          size: sizes,
          color: colors,
          sort,
        },
        "Enums fetched successfully"
      )
    );
  };
}

module.exports = EnumsService;
