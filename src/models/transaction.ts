import mongoose, { Schema, Document, model } from "mongoose";

interface Transaction extends Document {
  status: number;
  id_machine: string;
  currency: string[];
  balance: number; // Aseguramos que balance siempre sea un número (no opcional)
  message?: string;
  action: string;
  debit?: number;
  credit?: number;
  transaction: number;
}

interface TransactionModel extends mongoose.Model<Transaction> {
  formatBalance(balance: number): string;
}

// Función para truncar el número a un número específico de decimales
function truncateToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

const TransactionSchema = new Schema<Transaction>({
  status: { type: Number, default: 1 },
  id_machine: { type: String, required: true },
  currency: { type: [String], required: true },
  balance: {
    type: Number,
    required: true, // Hacemos balance obligatorio
    get: (value: number) => parseFloat(value.toFixed(2)), // Getter para asegurar que se recupere como decimal
    set: (value: number) => truncateToDecimals(value, 2), // Setter para truncar a 2 decimales antes de guardar
  },
  message: { type: String, required: false },
  action: { type: String, required: true },
  debit: { type: Number, required: false },
  credit: { type: Number, required: false },
  transaction: { type: Number, required: true, default: 1 },
});

// Middleware para actualizar el balance antes de guardar
TransactionSchema.pre('save', async function (next) {
  if (this.isModified('debit') || this.isModified('credit') || this.isNew) {
    if (this.isNew) {
      try {
        const lastTransaction = await this.constructor.findOne({ id_machine: this.id_machine }).sort({ transaction: -1 });

        if (lastTransaction) {
          this.transaction = lastTransaction.transaction + 1;
          this.balance = (lastTransaction.balance || 0) + (this.credit || 0) - (this.debit || 0);
        } else {
          this.transaction = 1; // Primera transacción
          this.balance = this.credit || 0; // Empezar con el crédito
        }
      } catch (error) {
        return next(error);
      }
    } else {
      this.balance = (this.balance || 0) + (this.credit || 0) - (this.debit || 0);
    }

    // Truncar balance después de la modificación
    this.balance = truncateToDecimals(this.balance, 2);
  }
  next();
});

// Método estático para formatear balance
TransactionSchema.statics.formatBalance = function (balance: number): string {
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(balance);
};

const Transaction = mongoose.models.Transaction || model<Transaction, TransactionModel>("Transaction", TransactionSchema);

export default Transaction;
