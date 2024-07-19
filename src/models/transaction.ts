import mongoose, { Schema, Document, model } from "mongoose";

interface Transaction extends Document {
    status: number;
    id_machine: string;
    currency: string[]; // Cambiar a un array de strings
    balance: number;
  }
  

interface TransactionModel extends mongoose.Model<Transaction> {
  formatBalance(balance: number): string;
}

const TransactionSchema = new Schema<Transaction>({
    status: { type: Number, default: 1 },
    id_machine: { type: String, required: true },
    currency: { type: [String], required: true }, // Definir como array de strings
    balance: { type: Number, required: true },
  });
  
// Agregar el método estático al esquema
TransactionSchema.statics.formatBalance = function (balance: number): string {
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return formatter.format(balance);
};

const Transaction = mongoose.models.Transaction || model<Transaction, TransactionModel>("Transaction", TransactionSchema);

export default Transaction;
