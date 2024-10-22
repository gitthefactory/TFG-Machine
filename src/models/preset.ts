import mongoose, { Schema, Document, model, Types } from 'mongoose';


// Definición de la interfaz de la máquina
interface Preset extends Document {
  games: any[];
  providers: any[];
}

// Definición del esquema de la máquina
const PresetSchema = new Schema<Preset>({
  games: { type: [{ type: Schema.Types.Mixed }], default: [] }, 
  providers: { type: [{ type: Schema.Types.Mixed }], default: [] }, // Array de tipo any[] similar a games
}, {
  timestamps: true,
});



// Definición del modelo de la máquina
const Preset = mongoose.models.Preset || model<Preset>('Preset', PresetSchema);

export default Preset;
