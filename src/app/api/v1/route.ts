import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

// GET ALL Transactions
export async function GET() {
  try {
    await connectDB();

    // Obtiene todas las transacciones
    const transactions = await Transaction.find();

    // Crear un objeto 'data' donde cada transacción es un objeto anidado
    let data = {};

    transactions.forEach((transaction, index) => {
      data = {
        // transaction: transaction._id,
        balance: transaction.balance,
        // Agrega más campos si es necesario
      };
    });

    const simulatedResponse = transactions.length > 0 ? {
      status: "OK",
      code: 200,
      data: data
    } : {
      status: "No transactions found",
      data: {}
    };

    return NextResponse.json(simulatedResponse, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      status: "Failed to get transactions",
      error: error.message,
    }, {
      status: 500,
    });
  }
}





export async function POST(request: { json: () => PromiseLike<{ status: number; currency: string[]; id_machine: string; balance: number; message?: string; action: string; debit?: number; credit: number; }> }) {
  try {
    const { status, currency, id_machine, balance, message, action, debit, credit } = await request.json();

    // Conectar a la base de datos
    await connectDB();

    // Crea una nueva transacción en base a los datos proporcionados
    const newTransactionData = {
      status,
      currency,
      id_machine,
      action,
      credit,
      balance,
      debit,
      message,
    };

       // Add message only if it is provided
       if (message) {
        newTransactionData.credit = credit;
      }

             // Add message only if it is provided
             if (message) {
              newTransactionData.balance = balance;
            }
  
    // Add debit only if it is provided
    if (debit !== undefined) {
      newTransactionData.debit = debit;
    }

    // Add message only if it is provided
    if (message) {
      newTransactionData.message = message;
    }

    const newTransaction = await Transaction.create(newTransactionData);

    return NextResponse.json({
      message: "Transacción Creada con Éxito",
      data: newTransaction
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al crear la Transacción",
        error,
      },
      {
        status: 500,
      }
    );
  }
}

// export async function DELETE(request: { nextUrl: { searchParams: { get: (arg0: string) => any; }; }; }){
//   try {
//       const id = request.nextUrl.searchParams.get("_id");
//       await connectDB();
//       await  Room.findByIdAndDelete(id);
      
//       return NextResponse.json(
//           {
//             message: "Sala eliminada Satisfactoriamente",
//           },
//           { status: 200 }
//         );
      
//   } catch (error) {
//       return NextResponse.json(
//           {
//             message: "Fallo al eliminar Sala",
//             error,
//           },
//           {
//             status: 500,
//           }
//         );
//   }
// }