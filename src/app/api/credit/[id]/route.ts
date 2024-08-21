import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    if (data.action !== 'CREDIT') {
      throw new Error('Acción no permitida. Solo se permite CREDIT en este endpoint.');
    }

    await connectDB();

    // Buscar la última transacción de la máquina específica para obtener el balance actual
    const lastTransaction = await Transaction.findOne({ id_machine: id }).sort({ transaction: -1 });

    // Calcular el nuevo balance sumando el crédito al balance existente para esa máquina específica
    const previousBalance = lastTransaction?.balance || 0;
    const newBalance = previousBalance + (data.credit || 0);

    // Crear los datos de la nueva transacción
    const newTransactionData = {
      action: data.action,
      status: 1,
      currency: data.currency || 'CLP',
      id_machine: id,
      balance: newBalance, // Nuevo balance calculado para la máquina específica
      message: data.message || '',
      debit: 0, // No hay débito en una transacción de crédito
      credit: data.credit || 0, // Asigna el valor de crédito ingresado
      user: data.user ? data.user.toUpperCase() : id.toUpperCase(), // Asigna el campo 'user' en mayúsculas
      amount: data.credit || 0, // El monto de la transacción es igual al crédito ingresado
      round: data.round || 0,
      transaction: (lastTransaction?.transaction || 0) + 1, // Incrementa el número de transacción
      extra_data: data.extra_data || [],
      game: data.game || 0,
      type: 1,
      provider: data.provider || 0,
    };

    // Crear la transacción para la máquina específica
    const newTransaction = await Transaction.create(newTransactionData);

    return NextResponse.json({
      status: "OK",
      code: 200,
      data: {
        transaction: newTransaction.transaction,
        balance: newTransaction.balance,
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        status: "FAILED",
        code: 500,
        data: {
          message: error.message || error,
        },
      },
      {
        status: 500,
      }
    );
  }
}
