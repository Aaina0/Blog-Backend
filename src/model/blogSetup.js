import mongoose from "mongoose";

const BlogSetupSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: true,
      unique: true,
    },
    blogLogo: {
      type: String,
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid image file!`,
      },
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogSetup = mongoose.model("BlogSetup", BlogSetupSchema);
export default BlogSetup;
