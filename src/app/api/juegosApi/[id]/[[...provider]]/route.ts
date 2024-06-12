import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Machine from "@/models/machine";

import Room from "@/models/room";


//Update/EDITING a MACHINE
export async function PUT(request: any, { params: { id } }: any) {
    try {
      const {
        newNombre,
        newGames
      } = await request.json();
  
      // Conectar a la base de datos
      await connectDB();
  
      // Construir el objeto con los datos actualizados de la máquina
      const updatedMachineData = {
        nombre: newNombre,
        games: newGames
      };
  
      // Actualizar la máquina en la base de datos
      const updatedMachine = await Machine.findByIdAndUpdate(id, updatedMachineData, { new: true });
  
      // Si el usuario asociado ha cambiado, puedes realizar una acción adicional aquí
  
      return NextResponse.json(
        {
          message: "Máquina Actualizada con Éxito",
          data: updatedMachine,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Error al actualizar la máquina",
          error,
        },
        {
          status: 500,
        }
      );
    }
  }



// Ruta para obtener una máquina por id y provider
export async function GET(request: any, { params: { id, provider } }: any) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Buscar la máquina por id_machine
    const maquina = await Machine.findOne({ id_machine: id });

    // Si no se encuentra la máquina, devolver un mensaje de error
    if (!maquina) {
      return NextResponse.json(
        {
          message: "Machine not found",
        },
        { status: 404 }
      );
    }

    // Poblar los datos de la sala en la máquina
    const maquinaConSala = await Room.populate(maquina, { path: 'room' });

    // Si no se proporciona un proveedor en la URL, devolver todos los juegos de la máquina sin filtrar
    if (!provider) {
      return NextResponse.json(
        {
          message: "Ok",
          data: maquinaConSala,
        },
        { status: 200 }
      );
    }

    // Filtrar los juegos que pertenecen al proveedor específico
    const juegosFiltrados = maquina.games.filter((group: { provider: number; }) => group.provider === parseInt(provider));

    // Clonar el objeto de la máquina y reemplazar los juegos con los juegos filtrados
    const maquinaConJuegosFiltrados = { ...maquinaConSala.toObject(), games: juegosFiltrados };

    // Devolver la respuesta con los juegos filtrados
    return NextResponse.json(
      {
        message: "Ok",
        data: maquinaConJuegosFiltrados,
      },
      { status: 200 }
    );
  } catch (error) {
    // Si ocurre un error, devolver un mensaje de error
    return NextResponse.json(
      {
        message: "Failed to fetch a Machine",
        error,
      },
      { status: 500 }
    );
  }
}