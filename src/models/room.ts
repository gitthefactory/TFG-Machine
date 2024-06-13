import mongoose, { Schema, Document, model, Types } from "mongoose";

interface Room extends Document {
  nombre: string;
  status: number;
  pais: string[];
  ciudad: string;
  comuna: string;
  client: Types.ObjectId;
  id_machine?: string[]; // Hacer id_machine un array opcional
}

const RoomSchema = new Schema<Room>({
  nombre: { type: String, required: true },
  status: { type: Number, default: 1 },
  pais: {
    type: [String],
    enum: ["Brazil", "Chile", "Estados Unidos", "Mexico", "Perú"],
    required: false,
  },
  ciudad: { type: String, required: false },
  comuna: { type: String, required: false },
  client: { type: Schema.Types.ObjectId, ref: "Client" },
  id_machine: { type: [String], required: false }, // Hacer id_machine un array opcional
},
{
  timestamps: true,
});

const Room = mongoose.models.Room || model<Room>("Room", RoomSchema);

export default Room;
