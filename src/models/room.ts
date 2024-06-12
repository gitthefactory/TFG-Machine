import mongoose, { Schema, Document, model, Types } from "mongoose";

// Definición de la interfaz de la sala
interface Room extends Document {
  nombre: string;
  //descripcion: string;
  // ruta: string;
  status: number;
  pais: string[];
  ciudad: string;
  comuna: string;
  operator: Types.ObjectId;
  client: Types.ObjectId;
}

// Definición del esquema de la sala
const RoomSchema = new Schema<Room>({
  nombre: { type: String, required: true },
  //descripcion: { type: String, required: false },
  // ruta: { type: String, required: true },
  status: { type: Number, default: 1 },
  pais: {
    type: [String],
    enum: ["Brazil", "Chile", "Estados Unidos", "Mexico", "Perú"],
    required: false,
  },
  ciudad: { type: String, required: false },
  comuna: { type: String, required: false },
  operator: { type: Schema.Types.ObjectId, ref: "Operator"},
  client: { type: Schema.Types.ObjectId, ref: "Client"},
},
{
  timestamps: true,
}
);

// Definición del modelo de la sala
const Room = mongoose.models.Room || model<Room>("Room", RoomSchema);

export default Room;
