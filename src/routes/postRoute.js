import express from "express";
import { createPost } from "../controllers/postController.js";
import { protect } from "../middleware/authorization.js";

const app = express.Router();

app.post("/create", createPost);

export default app;
