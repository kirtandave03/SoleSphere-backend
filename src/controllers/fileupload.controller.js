const apiResponse = require("../interfaces/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../services/cloudinary");
const apiError = require("../interfaces/apiError");

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.files) {
    throw new apiError(400, "File is required");
  }

  const images = req.files.map((image) => image.path);

  const urls = [];

  const imageToUpload = images.map((image) => {
    return new Promise((resolve, reject) => {
      return uploadOnCloudinary(image)
        .then((result) => {
          urls.push(result.url); // Push the URL into the urls array
          resolve(result); // Resolve the promise with the result
        })
        .catch((error) => {
          reject(error); // Reject the promise if there is an error
        });
    });
  });
  try {
    if (!imageToUpload) {
      throw new apiError(500, "Can not get the file");
    }

    // Wait for all uploads to finish
    await Promise.all(imageToUpload);
    res.status(200).json(new apiResponse(urls, "Files uploaded successfully"));
  } catch (err) {
    // Handle errors
    console.error("Error in uploading:", err);
    return res.status(500).json({ error: "Error in uploading images" });
  }
});

module.exports = uploadFile;
