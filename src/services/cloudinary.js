const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has successfully uploaded on cloudinary
    // console.log('file is uploaded on cloudinary',response.url);

    // console.log("Cloudinary response : ", response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //to remover locally saved file on server
    return null;
  }
};

const getPublicId = (url) => url.split("/").pop().split(".")[0];

const deleteOnCloudinary = async (url) => {
  try {
    if (!url) return false;

    const publicID = getPublicId(url);

    // Delete file on Cloudinary
    const response = await cloudinary.uploader.destroy(publicID);
    console.log("Deletion response:", response);

    if (response.result !== "ok") {
      console.error("Failed to delete Cloudinary resource:", response);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Deletion error:", error);
    return false;
  }
};

module.exports = { uploadOnCloudinary, deleteOnCloudinary };
