import mongoose, { Schema, Document, model } from "mongoose";

interface Transaction extends Document {
  status: number;
  id_machine: string;
  currency: string[];
  balance?: number;
  message?: string;
  action: string;
  debit?: number;  // Cambiado a número
  credit?: number;  // Cambiado a número
}

interface TransactionModel extends mongoose.Model<Transaction> {
  formatBalance(balance: number): string;
}

const TransactionSchema = new Schema<Transaction>({
  status: { type: Number, default: 1 },
  id_machine: { type: String, required: true },
  currency: { type: [String], required: true },
  balance: { type: Number, required: false },
  message: { type: String, required: false },
  action: { type: String, required: true },
  debit: { type: Number, required: false },  // Cambiado a número
  credit: { type: Number, required: false },  // Cambiado a número
});

// Middleware para actualizar el balance antes de guardar
TransactionSchema.pre('save', function (next) {
  if (this.isModified('debit') || this.isModified('credit')) {
    this.balance += (this.credit || 0) - (this.debit || 0);
  }
  next();
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
