import mongoose, { Schema, Document, model, Types } from "mongoose";

// Definición de la interfaz de la máquina
interface Machine extends Document {
  id_machine: string;
  status: number;
  games: any[];
  operator?: Types.ObjectId;
  client: Types.ObjectId;
  room: Types.ObjectId;
  providers: any[];
}

// Definición del esquema de la máquina
const MachineSchema = new Schema<Machine>({
  id_machine: { type: String }, 
  status: { type: Number, default: 1 },
  games: { type: [{ type: Schema.Types.Mixed }], default: [] },
  operator: { type: Schema.Types.ObjectId, ref: "Operator", required: false }, // Campo opcional
  client: { type: Schema.Types.ObjectId, ref: "Client" },
  room: { type: Schema.Types.ObjectId, ref: "Room" },
  providers: { type: [{ type: Schema.Types.Mixed }], default: [] }, // Array de tipo any[] similar a games
}, {
  timestamps: true,
});

// Función para generar sha-9 único
export function generateSha9(): string {
  const base = "XA5A";
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Genera un número aleatorio de 5 dígitos
  const randomString = randomNumber.toString().substring(0, 5); // Convierte el número en cadena y toma solo los primeros 5 dígitos
  const hash = base + randomString;
  return hash;
}

// Antes de guardar el documento, asigna un valor fijo a id_machine si está vacío
MachineSchema.pre('save', function (next) {
  const machine = this as any;
  if (!machine.isNew) {
    return next();
  }
  if (!machine.id_machine) {
    machine.id_machine = generateSha9(); // Asigna el valor generado por la función generateSha9()
  }
  next();
});

// Definición del modelo de la máquina
const Machine = mongoose.models.Machine || model<Machine>("Machine", MachineSchema);

export default Machine;
