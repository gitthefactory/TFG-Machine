import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Room from "@/models/room";


//GET ALL ROOMS
export async function GET() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todos los clientes con los datos del usuario asociado poblados
    const salas = await Room.find();

    // Devolver la respuesta con los datos de los clientes
    return NextResponse.json({
      message: "Ok",
      data: salas,
    }, {
      status: 200
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante el proceso
    return NextResponse.json({
      message: "Failed to get rooms",
      error,
    }, {
      status: 500,
    });
  }
}


//CREAR ROOM
export async function POST(request: { json: () => PromiseLike<{ nombre: any; descripcion: any; status: any; pais: any; ciudad: any; comuna: any; user: any; operator: any; client: any; }> }) {
    try {
      const { nombre, status, pais, ciudad, comuna, operator, client } = await request.json();
  


      const operatorValue = operator === "Seleccionar" ? null : operator;




      // Conectar a la base de datos
      await connectDB();
  
      // Crea una nueva máquina en base a los datos proporcionados
      const newMachine = await Room.create({
        nombre,
        //descripcion,
        // ruta,
        status,
        pais,
        ciudad,
        comuna,
        operatorValue,
        client,
      
      });
  
      return NextResponse.json({
          message: "Sala Creada con Éxito",
          data: newMachine
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



  //DELETE A ROOM
export async function DELETE(request: { nextUrl: { searchParams: { get: (arg0: string) => any; }; }; }){
  try {
      const id = request.nextUrl.searchParams.get("_id");
      await connectDB();
      await  Room.findByIdAndDelete(id);
      
      return NextResponse.json(
          {
            message: "Sala eliminada Satisfactoriamente",
          },
          { status: 200 }
        );
      
  } catch (error) {
      return NextResponse.json(
          {
            message: "Fallo al eliminar Sala",
            error,
          },
          {
            status: 500,
          }
        );
  }
}