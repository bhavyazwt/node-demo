const { permittedUpdates } = require("../../../constants");
const path = require("path");
const { User, UserImages, UserProfiles } = require("../models");
const { Op } = require("sequelize");
async function home(req, res) {
  return res
    .status(200)
    .json({ message: "Welcome to the User Management API!" });
}

async function getUsers(req, res) {
  try {
    const role = req?.query?.role;
    const isActive = req?.query?.isActive;
    const ageGt = req?.query?.ageGt;
    const filters = {};
    if (role) {
      filters.role = role;
    }
    if (isActive) {
      filters.isActive = isActive === "true" ? 1 : 0;
    }
    if (ageGt) {
      filters.ageGt = { [Op.gt]: ageGt };
    }
    try {
      const user = await User.findAll({
        include: [{ model: UserProfiles }, { model: UserImages }],
        where: filters,
      });
      if (!user.length)
        return res.status(404).json({ message: "No User Found" });
      else return res.status(200).json({ message: `Users Found`, data: user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function getUsersById(req, res) {
  const id = req?.params?.id;
  try {
    const user = await User.findAll({
      where: {
        id,
      },
    });
    if (!user.length)
      return res.status(404).json({ message: "User Not Found" });
    else
      return res
        .status(200)
        .json({ message: `User with ID ${id} found`, data: user });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, age, role, isActive } = req?.body;
    const user = await User.create({ name, email, age, role, isActive });
    if (user) {
      res
        .status(201)
        .json({ message: "User Inserted Successfully", data: user });
    }
  } catch (err) {
    if (
      err?.name === "SequelizeUniqueConstraintError" &&
      err?.errors?.[0]?.message === "email must be unique"
    ) {
      return res
        .status(500)
        .json({ error: "User with EmailID Already Exists" });
    }
    return res.status(500).json({ error: err?.errors?.[0]?.message });
  }
}

async function updateUser(req, res) {
  const id = req?.params?.id;
  const changedValues = req?.body;
  const changedValuesKeys = Object.keys(changedValues);

  if (!changedValuesKeys.length) {
    return res
      .status(403)
      .json({ error: "No Valid Parameter Passed To Update" });
  } else {
    //Validating only permitted updates
    let isUpdateValid = true;
    for (key of changedValuesKeys) {
      if (!permittedUpdates.includes(key)) {
        isUpdateValid = false;
        break;
      }
    }
    if (!isUpdateValid) {
      return res
        .status(401)
        .json({ error: "Value Not Permitted to be Updated" });
    } else {
      try {
        const isUpdated = await User.update(changedValues, { where: { id } });
        if (isUpdated[0]) {
          const updatedUser = await User.findAll({ where: { id } });
          return res
            .status(201)
            .json({ message: "User Updated Successfully", data: updatedUser });
        } else {
          return res.status(500).json({ error: "Error Updating User" });
        }
      } catch (err) {
        if (
          err?.name === "SequelizeUniqueConstraintError" &&
          err?.errors?.[0]?.message === "email must be unique"
        ) {
          return res
            .status(500)
            .json({ error: "User with EmailID Already Exists" });
        }
        return res.status(500).json({ error: err?.errors?.[0]?.message });
      }
    }
  }
}

async function deleteUser(req, res) {
  const id = req?.params?.id;
  try {
    const user = await User.destroy({
      where: { id },
    });

    if (!user) return res.status(404).json({ message: "User Not Found" });
    else return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ error: err?.errors?.[0]?.message });
  }
}

async function fileController(req, res) {
  const id = req.params.id;
  const { fileName, extension, mimeType } = req?.body;
  const imgPath = path.join(__dirname, "../tmp/uploads/img", fileName);
  const size = req.file.size;
  try {
    const userImage = await UserImages.create({
      UserId: id,
      imageName: fileName,
      path: imgPath,
      mimeType,
      extension,
      size,
    });
    if (userImage) {
      return res
        .status(201)
        .json({ message: "User Inserted Successfully", data: userImage });
    } else {
      return res
        .status(500)
        .json({ error: "Error Uploading File, Please Try Again in sometime." });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function createProfile(req, res) {
  const id = req.params.id;
  const { bio, linkedInUrl, facebookUrl, instaUrl } = req.body;
  try {
    const user_profile = await UserProfiles.create({
      UserId: id,
      bio,
      linkedInUrl,
      facebookUrl,
      instaUrl,
    });
    if (user_profile) {
      return res
        .status(201)
        .json({ message: "User Inserted Successfully", data: user_profile });
    }
  } catch (err) {
    if (
      err?.name === "SequelizeUniqueConstraintError" &&
      err?.errors?.[0]?.message === "UserId must be unique"
    ) {
      return res.status(500).json({ error: "User Profile Already Exists" });
    }
    return res.status(500).json({ error: err?.errors?.[0]?.message });
  }
}

async function getUserProfilesById(req, res) {
  const id = req?.params?.id;
  try {
    const user_profile = await UserProfiles.findAll({
      where: {
        id,
      },
    });
    if (!user_profile.length)
      return res.status(404).json({ message: "User Not Found" });
    else
      return res
        .status(200)
        .json({ message: `User with ID ${id} found`, data: user_profile });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function updateUserProfile(req, res) {
  const id = req?.params?.id;
  const { bio, linkedInUrl, facebookUrl, instaUrl } = req?.body;
  try {
    const isUpdated = await UserProfiles.update(
      { bio, linkedInUrl, facebookUrl, instaUrl },
      { where: { id } }
    );
    if (isUpdated[0]) {
      const updatedUser = await UserProfiles.findAll({ where: { id } });
      return res
        .status(201)
        .json({ message: "User Updated Successfully", data: updatedUser });
    } else {
      return res.status(500).json({ error: "Error Updating User" });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function deleteUserImage(req, res) {
  const userId = req?.params?.userId;
  try {
    const user_images = await UserImages.destroy({
      where: { userId },
    });

    if (!user_images)
      return res.status(404).json({
        error: `User Image for UserID ${userId} not found`,
      });
    else
      return res.status(200).json({
        message: `User Image for UserID ${userId} deleted successfully`,
      });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  home,
  updateUser,
  deleteUser,
  fileController,
  createProfile,
  getUserProfilesById,
  updateUserProfile,
  deleteUserImage,
};
