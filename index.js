import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import { getAll, getById } from "./src/controllers/user.controller.js";
import { register, login, logout } from "./src/controllers/auth.controller.js";
import {
  authenticate,
  isAdmin,
} from "./middlewares/authenticate.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes Auth
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/auth/logout", authenticate, logout);

// Routes Users
app.get("/api/user", authenticate, isAdmin, getAll);
app.get("/api/user/:id", authenticate, isAdmin, getById);

app.listen(process.env.PORT, () =>
  console.log(`Server is running at port: ${process.env.PORT}`)
);
