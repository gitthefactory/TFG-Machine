import mongoose, { Schema,Document, model, Types } from "mongoose";

interface Client extends Document{
  telefono: string;
  empresa: string;
  pais: string[];
  idioma: string[];
  direccion: string;
  comuna: string;
  ciudad: string;
  nombreCompleto: string;
  email: string;
  password: string;
  status: number;
  typeProfile: Types.ObjectId;
  tipoMoneda: string;
}

const ClientSchema = new Schema<Client>(
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
    typeProfile: {
      type: Schema.Types.ObjectId,
      ref: "ProfileType"
    },
    // id_machine: {
    //   type: String,
    //   ref: "Machine",
    //   required: false
    // },
    
  telefono: { type: String, required: false },
  empresa: { type: String, required: false },
  pais: {
    type: [String],
    enum: ["Brazil", "Chile", "Estados Unidos", "Mexico", "Perú"],
    required: false,
  },
  idioma: {
    type: [String],
    enum: ["Español/CL", "Español/MX", "Portugués", "Chino"],
    required: false,
  },
  direccion: { type: String, required: true },
  comuna: { type: String, required: false },
  ciudad: { type: String, required: true },
  status: { type: Number, default: 1 },
},
{
  timestamps: true,
}
);

const Client = mongoose.models.Client || model<Client>("Client", ClientSchema);

export default Client;
