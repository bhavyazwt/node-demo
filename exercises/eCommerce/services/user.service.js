const { User } = require("../models");

/**
 * @description Fetch User's Profile from ID
 * @param {number} id - user's id (Decoded from JWT)
 **/
async function getUserProfile(id) {
  try {
    const userProfile = await User.findOne({ where: { id } });
    return userProfile;
  } catch (err) {
    throw new Error("Error Finding User Details!");
  }
}

/**
 * @description Updates User Profile.
 * @param {number} id - user's id [Decoded From JWT]
 * @param {string} first_name - user's first name
 * @param {string} last_name - user's last name
 * @param {email} email - user's email
 **/
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

/**
 * @description - Get's user with a filter role (Default: All Roles)
 * @param {string} role - user's role ['customer', 'admin']
 **/
async function getUsers(
  role,
  limit = 10,
  page = 1,
  sort = "id",
  sortType = "ASC"
) {
  try {
    const users = await User.findAll({
      limit,
      offset: limit * (page - 1),
      order: [[sort, sortType]],
      ...(role && { where: { role } }),
    });
    return users;
  } catch (err) {
    console.log(err);
    throw new Error("Error Finding Users!");
  }
}

module.exports = { getUserProfile, updateUserProfile, getUsers };
