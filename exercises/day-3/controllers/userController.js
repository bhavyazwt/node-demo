const { users, permittedUpdates } = require("../constants");
const validateEmail = require("../validator/emailValidator");
const ageValidator = require("../validator/ageValidator");
const roleValidator = require("../validator/roleValidator");
const path = require("path");

async function home(req, res) {
  return res
    .status(200)
    .json({ message: "Welcome to the User Management API!" });
}

async function getUsers(req, res) {
  if (users) {
    const role = req?.query?.role;
    const isActive = req?.query?.isActive;
    const ageGt = req?.query?.ageGt;
    // console.log(typeof role, typeof isActive, typeof ageGt);
    let filteredUsers = users;
    if (role) {
      filteredUsers = filteredUsers?.filter((user) => user.role === role);
    }
    if (isActive) {
      filteredUsers = filteredUsers?.filter(
        (user) => String(user.isActive) === isActive
      );
    }
    if (ageGt) {
      filteredUsers = filteredUsers?.filter((user) => String(user.age) > ageGt);
    }
    return res.status(200).json({ users: filteredUsers });
  } else {
    return res.status(404).json({ message: "No Users Found" });
  }
}

async function getUsersById(req, res) {
  const id = req?.params?.id;
  const user = users.filter((user) => String(user.id) === id);
  if (!user.length) return res.status(404).json({ message: "User Not Found" });
  else return res.status(200).json(user);
}

async function createUser(req, res) {
  const { name, email, age, role, isActive } = req?.body;

  if (!name || !email || !age || !role || !isActive) {
    return res.status(403).json({
      error:
        "Please Give All Fields To Create User: Name, Email, Age, Role, isActive",
    });
  } else if (!validateEmail(email)) {
    return res.status(403).json({
      error: "Please Enter Valid Email Address",
    });
  } else if (!ageValidator(age)) {
    return res.status(403).json({
      error: "Please Enter Valid Age",
    });
  } else if (!roleValidator(role)) {
    return res.status(403).json({
      error: "Please Enter Valid Role",
    });
  } else if (isActive !== true && isActive !== false) {
    return res.status(403).json({
      error: "Please Enter Valid Active Status",
    });
  } else {
    const id = users.length + 1;
    const newUser = {
      id,
      name,
      email,
      age: Number(age),
      role,
      isActive: Boolean(isActive),
    };
    users.push(newUser);
    return res
      .status(201)
      .json({ message: "User Created Successfully", body: newUser });
  }
}

function findUserIndexById(id) {
  let foundIndex = null;
  for (let [index, user] of users.entries()) {
    if (String(user.id) === id) {
      foundIndex = index;
      break;
    }
  }
  return foundIndex;
}

async function updateUser(req, res) {
  const id = req?.params?.id;
  const changedValues = req?.body;
  const changedValuesKeys = Object.keys(changedValues);

  if (!changedValues.length) {
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
      const index = findUserIndexById(id);
      if (index >= 0) {
        users[index] = {
          ...users[index],
          ...changedValues,
        };
        return res.status(200).json(users[index]);
      } else {
        return res.status(403).json({ error: "User Not Found" });
      }
    }
  }
}

async function deleteUser(req, res) {
  const id = req?.params?.id;
  let userFound = false;
  users.forEach((user, index) => {
    if (String(user.id) === id) {
      users.splice(index, 1);
      userFound = true;
    }
  });

  if (!userFound) return res.status(404).json({ message: "User Not Found" });
  else return res.status(200).json({ message: "User Deleted Successfully" });
}

async function fileController(req, res) {
  const id = req.params.id;
  const { profileImage } = req.file;
  const index = findUserIndexById(id);
  users[index].profileImage = "../tmp/uploads" + req.body.fileName;
  return res
    .status(200)
    .json({ message: "File Upload Success", data: profileImage });
}

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  home,
  updateUser,
  deleteUser,
  fileController,
};
