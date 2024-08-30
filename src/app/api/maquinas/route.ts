import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Machine from "@/models/machine";
import { generateSha9, generateUUID } from "@/models/machine";


//GET ALL MACHINES
export async function GET() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todos los clientes con los datos del usuario asociado poblados
    const maquinas = await Machine.find();

    // Devolver la respuesta con los datos de los clientes
    return NextResponse.json({
      message: "Ok",
      data: maquinas,
    }, {
      status: 200
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante el proceso
    return NextResponse.json({
      message: "Failed to get machines",
      error,
    }, {
      status: 500,
    });
  }
}

// POST request
export async function POST(request: { json: () => PromiseLike<{ nombre: string; descripcion: string; status: number; games?: any[]; operator: string; client: string; room: string; pais: string; direccion: string; ciudad: string;  balance: number;}> }) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { nombre, descripcion, status, games = [], operator, client, room, pais, direccion, ciudad, balance } = await request.json();

    // Conectar a la base de datos (si aún no está conectada)
    await connectDB();

    // Generar el id_machine
    const id_machine = generateSha9();
    // Generar un token para la nueva máquina 
    const token = generateUUID();
    // Crear una nueva máquina en base a los datos proporcionados
    const newMachine = await Machine.create({
      nombre,
      id_machine,
      descripcion,
      status,
      games,
      operator,
      client,
      room,
      pais,
      direccion,
      ciudad,
      token,
      balance
    });

    // Devolver una respuesta con la máquina recién creada
    return NextResponse.json({
      message: "Máquina Creada con Éxito",
      data: newMachine
    }, { status: 201 });
  } catch (error) {
    // Manejar errores
    return NextResponse.json(
      {
        message: "Error al crear la Máquina",
        error,
      },
      {
        status: 500,
      }
    );
  }
}




//DELETE A MACHINE
export async function DELETE(request: { nextUrl: { searchParams: { get: (arg0: string) => any; }; }; }){
  try {
      const id = request.nextUrl.searchParams.get("_id");
      await connectDB();
      await  Machine.findByIdAndDelete(id);
      
      return NextResponse.json(
          {
            message: "Maquina eliminada Satisfactoriamente",
          },
          { status: 200 }
        );
      
  } catch (error) {
      return NextResponse.json(
          {
            message: "Fallo al eliminar Maquina",
            error,
          },
          {
            status: 500,
          }
        );
  }
}




// PUT (Actualizar una máquina)
export async function PUT(request: Request) {
  try {
    const { id } = request.nextUrl.searchParams;
    const { nombre, descripcion, status, games, operator, client, room, pais, direccion, ciudad, balance } = await request.json();
    await connectDB();
    
    const machine = await Machine.findById(id);
    if (!machine) {
      return NextResponse.json({ message: "Máquina no encontrada" }, { status: 404 });
    }

    // Actualizar los campos de la máquina
    if (nombre) machine.nombre = nombre;
    if (descripcion) machine.descripcion = descripcion;
    if (status !== undefined) machine.status = status;
    if (games) machine.games = games;
    if (operator) machine.operator = operator;
    if (client) machine.client = client;
    if (room) machine.room = room;
    if (pais) machine.pais = pais;
    if (direccion) machine.direccion = direccion;
    if (ciudad) machine.ciudad = ciudad;
    if (balance) machine.balance = balance;
    machine.updatedAt = new Date();
    const updatedMachine = await machine.save();

    return NextResponse.json({
      message: "Máquina Actualizada con Éxito",
      data: updatedMachine
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "Error al actualizar la máquina",
      error,
    }, {
      status: 500,
    });
  }
}