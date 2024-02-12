const File = require("../models/file");
const cloudniary = require("cloudinary").v2;

exports.localFileUpload = async(req, res) => {
    try {

        //fetch file from request
        const file = req.files.file;
        console.log("file--->", file);

        //create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("path is ", path);

        //add path to move function
        file.mv(path, (err) => {
            console.log(err);
        });

        //create a successful reaponse
        res.json({
            success: true,
            messsge: "Local file uploaded successfully"
        });
    } 
    catch (error) {
        console.log("Not able to upload file on server");
        console.log(error);
    }
}

function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudniary(file, folder){
    const options = {folder};
    await cloudniary.uploader.upload(file.tempFilePath, options);
}

//image upload handler
exports.imageUpload = async (req, res) => {
    try{
        const { name, tags, email } = req.body
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.plit('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            })
        }

        //file format supported
        const response = await uploadFileToCloudniary(File, "codehelp");
        console.log(response);

        //save entry in db
        // const fileData =await File.create({
        //     name, 
        //     tags, 
        //     email, 
        //     imageUrl
        // })

        res.json({
            success: true,
            message: `Image Successfully Uploaded`
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Couldn't upload image"
        })
    }
}