import mongoose, { Schema, Document, model } from "mongoose";

interface Transaction extends Document {
    status: number;
    id_machine: string;
    currency: string[]; 
    balance: number;
    message?: string;
    action: string;
    transaction: number;
    debit? : number;
    credit : number;
  }
  

interface TransactionModel extends mongoose.Model<Transaction> {
  formatBalance(balance: number): string;
}

const TransactionSchema = new Schema<Transaction>({
    status: { type: Number, default: 1 },
    id_machine: { type: String, required: true },
    currency: { type: [String], required: true }, 
    balance: { type: Number, required: true },
    message: { type: String, required: false },
    action: { type: String, required: true },
    transaction: { type: Number , required : true , default : 1},
    debit : {type: Number, required: false , default: 0},
    credit : {type: Number, required: false , default : 0}
  });


  // Middleware para actualizar el campo balance
  TransactionSchema.pre('save', async function (next) {
    if (this.isNew) {
      try {
        // Buscar la última transacción para la máquina especificada
        const lastTransaction = await this.constructor.findOne({ id_machine: this.id_machine }).sort({ transaction: -1 });
        
        if (lastTransaction) {
          this.transaction = lastTransaction.transaction + 1;
          
          // Actualizar el balance en función de los créditos y débitos
          this.balance = lastTransaction.balance + (this.credit || 0) - (this.debit || 0);
        } else {
          this.transaction = 0;
          this.balance = this.credit || 0; // Si es la primera transacción, el balance será igual al crédito
        }
      } catch (error) {
        return next(error);
      }
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
