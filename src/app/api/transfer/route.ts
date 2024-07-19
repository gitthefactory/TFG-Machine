import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";


//GET ALL Transaction
export async function GET() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todos los clientes con los datos del usuario asociado poblados
    const transaction = await Transaction.find();

    // Devolver la respuesta con los datos de los clientes
    return NextResponse.json({
      message: "Ok",
      data: transaction,
    }, {
      status: 200
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante el proceso
    return NextResponse.json({
      message: "Failed to get transaction",
      error,
    }, {
      status: 500,
    });
  }
}


export async function POST(request: { json: () => PromiseLike<{ status: any; currency: any; id_machine: any; balance: any; }> }) {
  try {
    const { status, currency, id_machine, balance } = await request.json();

    // Conectar a la base de datos
    await connectDB();

    // Crea una nueva máquina en base a los datos proporcionados
    const newTransaction = await Transaction.create({
      status,
      currency,
      id_machine,
      balance,
      
    });

    return NextResponse.json({
        message: "Transacción Creada con Éxito",
        data: newTransaction
    }, {status: 201});
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al crear la Sala",
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