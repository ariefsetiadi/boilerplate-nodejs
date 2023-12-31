import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import {
  authenticate,
  isAdmin,
} from "./src/middlewares/authenticate.middleware.js";

import {
  getAll,
  createUser,
  getById,
  updateUser,
  deleteUser,
  resetPassword,
} from "./src/controllers/user.controller.js";
import { register, login, logout } from "./src/controllers/auth.controller.js";

import {
  myProfile,
  changePassword,
} from "./src/controllers/profile.controller.js";

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
app.get("/api/user", authenticate, isAdmin, getAll);
app.post("/api/user/createUser", authenticate, isAdmin, createUser);
app.get("/api/user/:id", authenticate, isAdmin, getById);
app.put("/api/user/updateUser/:id", authenticate, isAdmin, updateUser);
app.delete("/api/user/deleteUser/:id", authenticate, isAdmin, deleteUser);
app.put("/api/user/resetPassword/:id", authenticate, isAdmin, resetPassword);

app.listen(process.env.PORT, () =>
  console.log(`Server is running at port: ${process.env.PORT}`)
);
