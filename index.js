const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Middleware
const {
  authenticate,
  isAdmin,
} = require("./src/middlewares/authenticate.middleware");

// Controller
// const {
//   getAll,
//   createUser,
//   getById,
//   updateUser,
//   deleteUser,
//   resetPassword,
// } = require("./src/controllers/user.controller");

const {
  register,
  login,
  logout,
} = require("./src/controllers/auth.controller");

const {
  myProfile,
  changePassword,
} = require("./src/controllers/profile.controller");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes Auth
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/auth/logout", authenticate, logout);

// Routes Profile
app.get("/api/auth/myProfile", authenticate, myProfile);
app.put("/api/auth/changePassword", authenticate, changePassword);

// Routes Users
// app.get("/api/user", authenticate, isAdmin, getAll);
// app.post("/api/user/createUser", authenticate, isAdmin, createUser);
// app.get("/api/user/:id", authenticate, isAdmin, getById);
// app.put("/api/user/updateUser/:id", authenticate, isAdmin, updateUser);
// app.delete("/api/user/deleteUser/:id", authenticate, isAdmin, deleteUser);
// app.put("/api/user/resetPassword/:id", authenticate, isAdmin, resetPassword);

app.listen(process.env.PORT, () =>
  console.log(`Server is running at port: ${process.env.PORT}`)
);
