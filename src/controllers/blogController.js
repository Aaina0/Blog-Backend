import asyncHandler from "../middleware/asyncHanddler.js";
import BlogSetup from "../model/blogSetup.js";
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import { CustomError } from "../middleware/errorHandler.js";

const createBlogSetup = asyncHandler(async (req, res, next) => {
  const { blogTitle, blogLogo, description } = req.body;

  const newBlogSetup = new BlogSetup({
    blogTitle,
    blogLogo,
    description,
  });

  await newBlogSetup.save();
  res
    .status(201)
    .json({ message: "Blog setup created successfully", data: newBlogSetup });
});

const BlogSetupSave = asyncHandler(async (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { blog_title, blog_description, blog_email, blog_name, blog_password } =
    req.body;
  const blog_image = req.file?.filename;

  const blogSetup = new BlogSetup({
    blogTitle: blog_title,
    blogLogo: blog_image,
    description: blog_description,
  });

  await blogSetup.save();

  const isUserExist = await User.exists({ email: blog_email });
  if (isUserExist) {
    return next(new CustomError(403, "User already exists"));
  }

  const hashedPassword = await bcrypt.hash(blog_password, 10);

  const user = new User({
    name: blog_name,
    email: blog_email,
    password: hashedPassword,
    is_admin: true,
  });

  await user.save();

  res
    .status(201)
    .json({ message: "Blog setup and admin user created successfully" });
});

export { createBlogSetup, BlogSetupSave };
