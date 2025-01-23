let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    role: "Admin",
    isActive: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    role: "User",
    isActive: true,
  },
];

const permittedUpdates = ["name", "email", "age", "role", "isActive"];

const roles = ["User", "Admin"];

module.exports = { users, permittedUpdates, roles };
