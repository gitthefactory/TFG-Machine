import mongoose, { Schema, Document, model, Types } from "mongoose";

interface Room extends Document {
  nombre: string;
  status: number;
  pais: string[];
  ciudad: string;
  comuna: string;
  client: Types.ObjectId;
  id_machine?: string[];
  operator?: Types.ObjectId;
  currency: string[]; 
  address: string;
  phone: number;

}

const RoomSchema = new Schema<Room>({
  nombre: { type: String, required: true },
  status: { type: Number, default: 1 },
  pais: {
    type: [String],
    enum: ["Brazil", "Chile", "República Dominicana", "Mexico", "Perú"],
    required: false,
  },
  ciudad: { type: String, required: false },
  comuna: { type: String, required: false },
  client: { type: Schema.Types.ObjectId, ref: "Client" },
  operator: { type: Schema.Types.ObjectId, ref: "Operator", required: false },
  id_machine: { type: [String], required: false },
  currency: {
      type: [String],
      enum: ["CLP", "PEN", "MXN", "RBL", "USD", "DOP"],
    required: false,
  },
  address: { type: String, required: true },
  phone: { type: Number, default: 1 },
  },
{
  timestamps: true,
});

const Room = mongoose.models.Room || model<Room>("Room", RoomSchema);

export default Room;
