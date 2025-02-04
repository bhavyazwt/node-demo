const { permittedUpdates } = require("../../../constants");
const path = require("path");
const { User, UserImages, UserProfiles } = require("../models");
const { Op, where } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  cookie: {
    name: "refreshTkn",
    options: {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  },
};
const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
};

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
    const limit = req?.query?.limit ?? 10;
    const page = req?.query?.page ?? 1;
    const sort = req?.query?.sort ?? "createdAt";
    const sortType = req?.query?.sortType ?? "ASC";

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
        limit: Number(limit),
        offset: limit * (page - 1),
        where: filters,
        order: [[sort, sortType]],
      });
      return res.status(200).json({ message: `Users Found`, data: user });
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
    else {
      return res
        .status(200)
        .json({ message: `User with ID ${id} found`, data: user_profile });
    }
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

async function deleteUserProfile(req, res) {
  const id = req?.params?.id;
  try {
    const user_profile = await UserProfiles.destroy({
      where: {
        id,
      },
    });
    if (!user_profile) {
      return res.status(404).json({
        error: `User Profile for ID ${id} not found`,
      });
    } else {
      return res.status(200).json({
        message: `User Profile for ID ${id} deleted successfully`,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function signUp(req, res) {
  try {
    const { name, email, age, role, isActive, password } = req?.body;
    const user = await User.create({
      name,
      email,
      age,
      role,
      isActive,
      password,
    });
    // console.log(user);
    if (user) {
      const accessToken = await user.generateAccessToken(); // Create Access Token
      const refreshToken = await user.generateRefreshToken(); // Create Refresh Token
      res.cookie(
        REFRESH_TOKEN.cookie.name,
        refreshToken,
        REFRESH_TOKEN.cookie.options
      );

      res.status(201).json({
        success: true,
        user,
        accessToken,
      });
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
    return res.status(500).json(err);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req?.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "User is not registered!" });
    const isPassValid = user.validPassword(email, password);
    if (!isPassValid)
      return res.status(403).json({ error: "Invalid Email/Password." });
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );
    res.json({
      success: true,
      user,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
}

async function refreshAuthToken(req, res) {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

    if (!refreshToken) {
      throw new Error("Unauthorised User!");
    }
    const decodedRefreshTkn = jwt.verify(refreshToken, REFRESH_TOKEN.secret);
    console.log(decodedRefreshTkn);
    const refreshTknHash = await bcrypt.hash(refreshToken, 10);
    console.log("hash", refreshTknHash);
    const userWithRefreshTkn = await User.findOne({
      where: { id: decodedRefreshTkn.id, token: refreshTknHash },
    });
    console.log("new", userWithRefreshTkn);
    if (!userWithRefreshTkn) {
      throw new Error("Unauthorised User!");
    }
    const newAcessTkn = await userWithRefreshTkn.generateAccessToken();
    return res.status(201).json({
      success: true,
      accessToken: newAcessTkn,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
}
// app.post("/refresh");
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
  deleteUserProfile,
  signUp,
  login,
  refreshAuthToken,
};
