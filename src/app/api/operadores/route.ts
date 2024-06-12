import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Operator from "@/models/operator";


//GET ALL OPERADORES
export async function GET() {
  try {
      // Conectar a la base de datos
      await connectDB();

      // Obtener todos los operadores
      const operadores = await Operator.find();

      // Devolver la respuesta con los datos de los operadores
      return NextResponse.json({
          message: "Ok",
          data: operadores,
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

//CREATE  A NEW OPERADOR
export async function POST(request: { json: () => PromiseLike<{  operator: any; client: any; status: any; maquina: any; }> | { operator: any; client: any; status: any;  maquina: any; }; }) {
    try {
      const { client, status, operator, maquina} = await request.json();
  
      // Conectar a la base de datos
      await connectDB();
  
      // Crea un nuevo cliente en base a los datos proporcionados
      const newClient = await Operator.create({
        operator,
        client,
        status,
        maquina,
      });
  
      return NextResponse.json({
          message: "Operador Creado con Éxito",
          data: newClient
      }, {status: 201});
    } catch (error) {
      return NextResponse.json(
        {
          message: "Error al crear el Operador",
          error,
        },
        {
          status: 500,
        }
      );
    }
  }



  //ELIMINAR OPERADORES
export async function DELETE(request: { nextUrl: { searchParams: { get: (arg0: string) => any; }; }; }){
  try {
      const id = request.nextUrl.searchParams.get("_id");
      await connectDB();
      await  Operator.findByIdAndDelete(id);
      
      return NextResponse.json(
          {
            message: "Operador eliminado satisfactoriamente",
          },
          { status: 200 }
        );
      
  } catch (error) {
      return NextResponse.json(
          {
            message: "Error al eliminar un operador",
            error,
          },
          {
            status: 500,
          }
        );
  }
}