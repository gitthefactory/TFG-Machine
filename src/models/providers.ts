import mongoose, { Schema, model, Types } from 'mongoose';

// Interfaz para definir la estructura de los datos del proveedor
interface Provider {
  provider: number;
  provider_name: string;
  status: number;
  user: Types.ObjectId;
}

// Define el esquema para el proveedor
const providerSchema = new Schema<Provider>({
  provider: { type: Number, required: true },
  provider_name: { type: String, required: true },
  status: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" }
},
{
  timestamps: true // Opcional: agrega campos de fecha de creación y actualización automáticamente
});

// Define el modelo Provider basado en el esquema
const ProviderModel = mongoose.models.Provider || model<Provider>('Provider', providerSchema);

export default ProviderModel;