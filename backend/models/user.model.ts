import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  password: String,

  roleId: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

export default mongoose.model("User", UserSchema);