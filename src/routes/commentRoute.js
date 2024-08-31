// routes/commentRoute.js
import express from "express";
import { addComment, addReply } from "../controllers/commentController.js";

const app = express.Router();

app.post("/create", addComment);


app.post("/reply", addReply);


export default app;
