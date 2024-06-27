import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import ProvidersModel from "@/models/providers"; // Cambiado el nombre de la importación para evitar conflictos de nombres

// GET ALL PROVIDERS
export async function GET() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todos los proveedores
    const providers = await ProvidersModel.find(); // Utilizar el modelo correctamente

    // Devolver la respuesta con los datos de los proveedores
    return NextResponse.json({
      message: "Ok",
      data: providers,
    }, {
      status: 200
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante el proceso
    return NextResponse.json({
      message: "Failed to get providers",
      error,
    }, {
      status: 500,
    });
  }
}


// export async function PUT(request, { params: { id } }) {
//   try {
//     const { status } = await request.json(); // Obtenemos el campo 'status' del cuerpo JSON

//     // Validar que el estado solo puede ser 0 o 1
//     if (status !== 0 && status !== 1) {
//       return new Response(
//         JSON.stringify({ message: "Estado no válido. Debe ser 0 o 1" }),
//         { status: 400 }
//       );
//     }

//     // Conectar a la base de datos
//     await connectDB(); // Asegúrate de que la función connectDB() esté definida y funcione correctamente

//     // Buscar el proveedor por su ID
//     const provider = await ProvidersModel.findById(id);

//     if (!provider) {
//       return new Response(
//         JSON.stringify({ message: "Proveedor no encontrado" }),
//         { status: 404 }
//       );
//     }

//     // Actualizar el estado del proveedor
//     provider.status = status;

//     // Guardar el proveedor actualizado
//     const updatedProvider = await provider.save();

//     return new Response(
//       JSON.stringify({
//         message: "Estado de proveedor actualizado con éxito",
//         data: updatedProvider,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({
//         message: "Error al actualizar el estado del proveedor",
//         error: error.message,
//       }),
//       { status: 500 }
//     );
//   }
// }