const {
  getUserProfile,
  updateUserProfile,
  getUsers,
} = require("../services/user.service");

/**
 * @description Gets profile of logged in user (Based on JWT)
 **/
async function getProfile(req, res) {
  try {
    const userId = req?.userId;
    const userProfile = await getUserProfile(userId);
    res.status(200).json({
      message: "User Profile Fetched Successfully",
      data: userProfile,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 *  @description LoggedIn User Can Update their profile.
 **/
async function updateProfile(req, res) {
  try {
    const userId = req?.userId;
    const { first_name, last_name, email } = req?.body;
    const isProfileUpdated = await updateUserProfile(
      userId,
      first_name,
      last_name,
      email
    );
    if (isProfileUpdated) {
      const userProfile = await getUserProfile(userId);
      res
        .status(201)
        .json({ message: "User Updated Successfully", data: userProfile });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @description Gets All Users [ONLY FOR ADMINS]
 **/

async function getAllUsers(req, res) {
  const role = req.query.role ?? null;
  const limit = req?.query?.limit ?? 10;
  const page = req?.query?.page ?? 1;
  const sort = req?.query?.sort ?? "id";
  const sortType = req?.query?.sortType ?? "ASC";
  try {
    const allUsers = await getUsers(role, limit, page, sort, sortType);
    if (allUsers) {
      res.status(200).json(allUsers);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getProfile, updateProfile, getAllUsers };
