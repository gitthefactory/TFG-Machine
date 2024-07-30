import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Providers from "@/models/providers"; // Cambiado el nombre de la importación para evitar conflictos de nombres

//GET ALL OPERADORES
export async function GET() {
  try {
      // Conectar a la base de datos
      await connectDB();

      // Obtener todos los operadores
      const providers = await Providers.find();

      // Devolver la respuesta con los datos de los operadores
      return NextResponse.json({
          message: "Ok",
          data: providers,
      }, {
          status: 200
      });
  } catch (error) {
      // Manejar cualquier error que pueda ocurrir durante el proceso
      return NextResponse.json({
          message: "Error al obtener los operadores",
          error,
      }, {
          status: 500,
      });
  }
}
