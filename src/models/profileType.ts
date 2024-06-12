import mongoose, { Schema, model } from "mongoose";

interface ProfileType {
  typeProfile: string;
}

const ProfileTypeSchema = new Schema<ProfileType>({
  typeProfile: {
    type: String,
    required: true,
    default: "660ebaa7b02ce973cad66553",
  }
});

const ProfileType = mongoose.models.ProfileType || model<ProfileType>("ProfileType", ProfileTypeSchema);

export default ProfileType;
