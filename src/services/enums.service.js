const apiResponse = require("../interfaces/apiResponse");

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

    return res
      .status(200)
      .json(
        new apiResponse(
          { sizeType, closureType, material, gender },
          "Enums fetched successfully"
        )
      );
  };
}

module.exports = EnumsService;
