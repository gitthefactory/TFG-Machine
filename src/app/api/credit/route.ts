import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

export async function POST(request) {
  try {
    const data = await request.json();
    // console.log("Datos recibidos:", data);

    await connectDB();

    if (data.action !== 'CREDIT') {
      throw new Error('Acción no permitida. Solo se permite CREDIT en este endpoint.');
    }

    // Asegúrate de que el campo 'user' esté en mayúsculas
    const user = data.user ? data.user.toUpperCase() : (data.id_machine || '').toUpperCase();

    // Buscar la última transacción para obtener el balance actual
    const lastTransaction = await Transaction.findOne({ id_machine: data.id_machine }).sort({ transaction: -1 });

    // Calcular el nuevo balance sumando el crédito al balance existente
    const newBalance = (lastTransaction?.balance || 0) + (data.credit || 0);

    // Crear los datos de la nueva transacción
    const newTransactionData = {
      action: data.action,
      status: 1,
      currency: data.currency || ['CLP'],
      id_machine: data.id_machine,
      balance: newBalance, // Nuevo balance calculado
      message: data.message || '',
      debit: 0, // No hay débito en una transacción de crédito
      credit: data.credit || 0, // Asigna el valor de crédito ingresado
      user: user, // Asigna el campo 'user' en mayúsculas
      amount: data.credit || 0, // El monto de la transacción es igual al crédito ingresado
      round: data.round || 0,
      transaction: (lastTransaction?.transaction || 0) + 1, // Incrementa el número de transacción
      extra_data: data.extra_data || [],
      game: data.game || 0,
      type: 1,
      provider: data.provider || 0,
    };

    // console.log("Datos de transacción antes de crear:", newTransactionData);

    // Crear la transacción
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
    // console.error("Error al crear la Transacción:", error.message || error);
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
