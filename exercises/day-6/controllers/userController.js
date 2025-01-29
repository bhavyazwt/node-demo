const { permittedUpdates } = require("../../../constants");
const path = require("path");
const { User, UserImages, UserProfiles } = require("../models");
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
    let filters = "";
    if (role) {
      filters += ` where role = '${role}'`;
    }
    if (isActive) {
      if (filters) filters += `, isActive = '${isActive}'`;
      else filters += ` where isActive = '${isActive}'`;
    }
    if (ageGt) {
      if (filters) filters += `, age > '${ageGt}'`;
      else filters += ` where age > '${ageGt}'`;
    }
    const [users] = await pool.query(
      `SELECT 
        users.id,
        users.name,
        users.email,
        users.age,
        users.role,
        users.isActive, 
        user_images.imageName,
        user_images.path,
        user_images.mimeType,
        user_images.extension,
        user_images.size,
        user_profiles.bio,
        user_profiles.linkedInUrl,
        user_profiles.facebookUrl,
        user_profiles.instaUrl
        FROM USERS
        LEFT JOIN user_images ON users.id = user_images.userId
        LEFT JOIN user_profiles ON users.id = user_profiles.userId
        ` + filters
    );

    if (!users.length) {
      return res.status(404).json({ error: "No Users Found" });
    }
    return res
      .status(200)
      .json({ message: "Users Fetched Successfully", data: users });
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
      console.log(user);
      res
        .status(201)
        .json({ message: "User Inserted Successfully", data: user });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
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
      const isUpdated = await User.update(changedValues, { where: { id } });
      console.log(isUpdated);
      if (isUpdated[0]) {
        const updatedUser = await User.findAll({ where: { id } });
        return res
          .status(201)
          .json({ message: "User Updated Successfully", data: updatedUser });
      } else {
        return res.status(500).json({ error: "Error Updating User" });
      }
    }
  }
}

async function deleteUser(req, res) {
  const id = req?.params?.id;
  const user = await User.destroy({
    where: { id },
  });

  if (!user) return res.status(404).json({ message: "User Not Found" });
  else return res.status(200).json({ message: "User Deleted Successfully" });
}

async function fileController(req, res) {
  console.log(req.body.fileName);
  const id = req.params.id;
  const { fileName, extension, mimetype } = req?.body;
  console.log("filenameeee", fileName);
  const imgPath = path.join(__dirname, "../tmp/uploads/img", fileName);
  const size = req.file.size;
  console.log(imgPath);

  const userImage = await UserImages.create({
    userId: id,
    imageName,
    path: imgPath,
    mimetype,
    extension,
    size,
  });
  if (userImage) {
    console.log(userImage);
    res
      .status(201)
      .json({ message: "User Inserted Successfully", data: userImage });
  } else {
    return res
      .status(500)
      .json({ error: "Error Uploading File, Please Try Again in sometime." });
  }
}

async function createProfile(req, res) {
  const id = req.params.id;
  const { bio, linkedInUrl, facebookUrl, instaUrl } = req.body;
  const createProfileQuery = `INSERT INTO user_profiles(userId,bio,linkedInUrl,facebookUrl,instaUrl) VALUES (?,?,?,?,?)`;
  const [userProfile] = await pool.query(createProfileQuery, [
    id,
    bio,
    linkedInUrl,
    facebookUrl,
    instaUrl,
  ]);

  if (userProfile) {
    const { insertId } = userProfile;
    console.log(insertId);
    const [insertedUser] = await pool.query(
      `SELECT * FROM user_profiles WHERE id = ${insertId}`
    );
    res
      .status(201)
      .json({ message: "User Inserted Successfully", data: insertedUser });
  }
}

async function getUserProfilesById(req, res) {
  const id = req?.params?.id;
  console.log(id);
  try {
    const [user] = await pool.query(
      `SELECT * FROM user_profiles WHERE id = ?`,
      id
    );
    if (!user.length)
      return res.status(404).json({ message: "User Not Found" });
    else
      res
        .status(200)
        .json({ message: `User with ID ${id} found`, data: user[0] });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function updateUserProfile(req, res) {
  const id = req?.params?.id;
  const { bio, linkedInUrl, facebookUrl, instaUrl } = req?.body;
  const updateQuery = `
  UPDATE user_profiles
  SET 
  bio = ?,
  linkedInUrl = ?,
  facebookUrl = ?,
  instaUrl = ?
  WHERE 
  id = ?
  `;

  await pool.query(updateQuery, [bio, linkedInUrl, facebookUrl, instaUrl, id]);
  const [updatedUser] = await pool.query(
    `SELECT * FROM user_profiles WHERE id = ${id}`
  );
  return res
    .status(201)
    .json({ message: "User Updated Successfully", data: updatedUser });
}

async function deleteUserImage(req, res) {
  const userId = req?.params?.userId;
  const [{ affectedRows }] = await pool.query(
    "DELETE FROM user_images WHERE userId = ?",
    userId
  );

  if (!affectedRows)
    return res.status(404).json({ message: "No Images Found" });
  else return res.status(200).json({ message: "Image Deleted Successfully" });
}

async function createUserData(req, res) {
  try {
    const { name, email, age, role, isActive, fileName } = req?.body;
    const pdfPath = path.join(__dirname, "../tmp/uploads/pdf", fileName);

    const [user] = await pool.query(
      "INSERT INTO users_data (name,email,age,role,isActive,pdf) VALUES (?,?,?,?,?,?);",
      [name, email, age, role, isActive, pdfPath]
    );
    if (user) {
      const { insertId } = user;
      console.log(insertId);
      const [insertedUser] = await pool.query(
        `SELECT * FROM users_data WHERE id = ${insertId}`
      );
      res
        .status(201)
        .json({ message: "User Inserted Successfully", data: insertedUser });
    }
  } catch (err) {
    return res.status(500).json({ error: err.sqlMessage });
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
  createUserData,
};
