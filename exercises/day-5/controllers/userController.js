const { permittedUpdates } = require("../../../constants");
const { pool } = require("../db/db");

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
  console.log(id);
  try {
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", id);
    console.log(user);
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

async function createUser(req, res) {
  try {
    const { name, email, age, role, isActive } = req?.body;
    const [user] = await pool.query(
      "INSERT INTO users (name,email,age,role,isActive) VALUES (?,?,?,?,?);",
      [name, email, age, role, isActive]
    );
    if (user) {
      const { insertId } = user;
      console.log(insertId);
      const [insertedUser] = await pool.query(
        `SELECT * FROM users WHERE id = ${insertId}`
      );
      res
        .status(201)
        .json({ message: "User Inserted Successfully", data: insertedUser });
    }
  } catch (err) {
    return res.status(500).json({ error: err.sqlMessage });
  }
}

const buildPatchQuery = (table, id, data) => {
  if (Object.keys(data).length === 0) return null;
  let sql = `UPDATE ${table} SET`;
  Object.entries(data).forEach(([key, value], index) => {
    const valueToSet = typeof data[key] === "string" ? `'${value}'` : value;
    sql +=
      Object.keys(data).length - 1 === index
        ? ` ${key}=${valueToSet}`
        : ` ${key}=${valueToSet},`;
  });
  sql += ` WHERE id=${id};`;
  return sql;
};

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
      const updateQuery = buildPatchQuery("users", id, changedValues);
      await pool.query(updateQuery);
      const [updatedUser] = await pool.query(
        `SELECT * FROM users WHERE id = ${id}`
      );
      return res
        .status(201)
        .json({ message: "User Updated Successfully", data: updatedUser });
    }
  }
}

async function deleteUser(req, res) {
  const id = req?.params?.id;
  const [{ affectedRows }] = await pool.query(
    "DELETE FROM users WHERE id = ?",
    id
  );

  if (!affectedRows) return res.status(404).json({ message: "User Not Found" });
  else return res.status(200).json({ message: "User Deleted Successfully" });
}

async function fileController(req, res) {
  const id = req.params.id;
  const { profileImage } = req.file;
  const { fileName, extension, mimetype } = req?.body;
  const path = "../tmp/uploads" + req.body.fileName;
  const size = req.file.size;

  const imageUploadQuery = `INSERT INTO user_images (userId,imageName,path,mimeType,extension,size) VALUES (?,?,?,?,?,?)`;
  const [{ affectedRows }] = await pool.query(imageUploadQuery, [
    id,
    fileName,
    path,
    mimetype,
    extension,
    size,
  ]);
  if (affectedRows) {
    return res
      .status(200)
      .json({ message: "File Upload Success", data: profileImage });
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
