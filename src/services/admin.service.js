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
}
module.exports = AdminService;
