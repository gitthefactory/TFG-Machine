import mongoose, { Schema, model, Types } from 'mongoose';

// Interfaz para definir la estructura de los datos de games
interface Games {
  provider_name: string; 
  provider: number;
  games: any[];
  status: boolean;
  img: string;
}

// Define el esquema para games
const gamesSchema = new Schema<Games>({
  provider_name: { type: String },
  provider: { type: Number },
  games: [{ type: Schema.Types.Mixed }],
  status: { type: Boolean },
  img: { type: String },
},
{
  timestamps: true, // Opcional: agrega campos de fecha de creación y actualización automáticamente
  collection: 'games' // Establece el nombre de la colección en MongoDB
});


// Define el modelo Games basado en el esquema
const GamesModel = mongoose.models.Games || model<Games>('Games', gamesSchema);

export default GamesModel;
