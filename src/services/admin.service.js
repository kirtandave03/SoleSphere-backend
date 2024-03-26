const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
class AdminService {
  constructor() {}

  getAllUsers = async (req, res) => {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 5;
    const deleted = Boolean(req.query.deleted) || false;

    const { q } = req.query;

    const totalCount = (await User.find()).length;

    if (deleted) {
      const deletedUsers = await User.findDeleted({ deleted: true });
      return res
        .status(200)
        .json(new apiResponse(deletedUsers, "Deleted Users"));
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
    }

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
        new apiResponse({ users, totalCount }, "All users fetched successfully")
      );
  };

  deleteUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params._id });

    if (!user) {
      throw new apiError(404, "User not found");
    }

    // Soft delete the user
    await user.delete();

    const deletedUsers = await User.find({ deleted: true });
    const response = { deletedUsers, deletedUser: user };

    return res
      .status(200)
      .json(new apiResponse(response, "User Deleted successfully"));
  };
}
module.exports = AdminService;
