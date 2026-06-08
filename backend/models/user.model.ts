import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  roleId?: mongoose.Types.ObjectId;
  avatar?: string;
  providers?: {
    google?: {
      id?: string;
      email?: string;
    };
    facebook?: {
      id?: string;
      email?: string;
    };
  };
}

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
  },
  avatar: String,
  providers: {
    google: {
      id: {
        type: String,
        index: true // fast lookup for Google login
      },
      email: String
    },
    facebook: {
      id: {
        type: String,
        index: true // fast lookup for Facebook login
      },
      email: String
    }
  },
});

export default mongoose.model<IUser>("User", UserSchema);