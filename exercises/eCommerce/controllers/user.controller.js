const {
  getUserProfile,
  updateUserProfile,
  getUsers,
} = require("../services/user.service");

async function getProfile(req, res) {
  try {
    const userId = req?.userId;
    console.log("user from eget", userId);
    const userProfile = await getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req?.userId;
    const { first_name, last_name, email } = req?.body;
    console.log("userrrr", userId);
    const isProfileUpdated = await updateUserProfile(
      userId,
      first_name,
      last_name,
      email
    );
    if (isProfileUpdated) {
      const userProfile = await getUserProfile(userId);
      res.status(201).json(userProfile);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const allUsers = await getUsers();
    if (allUsers) {
      res.status(200).json(allUsers);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getProfile, updateProfile, getAllUsers };
