import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  BlogSetupSave,
  createBlogSetup,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authorization.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(express.json());

app.post("/create", protect, createBlogSetup);
app.post("/setup", upload.single("blog_image"), BlogSetupSave);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
});

export default app;
