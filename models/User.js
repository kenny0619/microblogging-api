const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: string,
    email: string,
    bio: string,
    image: string,
    hash: string,
    salt: string,
  },
  {
    timestamps: true,
  }
);

mongoose.model("User", UserSchema);
