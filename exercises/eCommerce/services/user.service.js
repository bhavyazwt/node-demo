const { User } = require("../models");

async function getUserProfile(id) {
  try {
    const userProfile = await User.findOne({ where: { id } });
    return userProfile;
  } catch (err) {
    throw new Error("Error Finding User Details!");
  }
}

async function updateUserProfile(id, first_name, last_name, email) {
  try {
    const [isUpdated] = await User.update(
      { first_name, last_name, email },
      { where: { id } }
    );
    if (isUpdated) {
      return true;
    } else {
      throw new Error("Error Updating User");
    }
  } catch (err) {
    throw new Error("Error Updating User");
  }
}

async function getUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (err) {
    throw new Error("Error Finding Users!");
  }
}

module.exports = { getUserProfile, updateUserProfile, getUsers };
