import mongoose, { Schema, Document, Types, model } from "mongoose";

interface User extends Document {
  nombreCompleto: string;
  email: string;
  password: string;
  status: number;
  typeProfile: Types.ObjectId;
  id_machine: string[];
  games: any[];
  client?: Types.ObjectId; // Optional field
}

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    nombreCompleto: {
      type: String,
      required: [true, "nombreCompleto is required"],
      minLength: [3, "nombreCompleto must be at least 3 characters"],
      maxLength: [50, "nombreCompleto must be at most 50 characters"],
    },
    games: { type: [{ type: Schema.Types.Mixed }], default: [] },
    status: {
      type: Number,
      default: 1,
    },
    typeProfile: {
      type: Schema.Types.ObjectId,
      ref: "ProfileType",
    },
    id_machine: [{ type: String }],
    client: { type: Schema.Types.ObjectId, ref: "Client" }, // Added client field here
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || model<User>("User", UserSchema);

export default User;
