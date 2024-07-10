import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Machine from "@/models/machine";
import Room from "@/models/room";


//GET A ONE MACHINE
export async function GET(request: any, { params: { id } }: any) {
    try {
      //conetar a BD
      await connectDB();
      //get data using model
      const maquinas = await Machine.findOne({ _id: id });
      return NextResponse.json(
        {
          message: "Ok",
          data: maquinas,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Failed to fecth a Machine",
          error,
        },
        {
          status: 500,
        }
      );
    }
  }


  
  export async function PUT(request: any, { params: { id } }: any) {
    try {
      const { games: newGame, status, providers } = await request.json();
  
      console.log("Datos recibidos:", { newGame, status, providers });
  
      // Conectar a la base de datos
      await connectDB();
  
      // Encontrar la máquina por su ID
      const machine = await Machine.findById(id);
  
      // Verificar si la máquina existe
      if (!machine) {
        return NextResponse.json(
          {
            message: "Máquina no encontrada",
          },
          { status: 404 }
        );
      }
  
      // Actualizar el estado del juego existente sin duplicar
      if (newGame) {
        const existingGameIndex = machine.games.findIndex((game: any) => game.id === newGame.id);
        if (existingGameIndex > -1) {
          // Actualizar el juego existente
          machine.games[existingGameIndex] = { ...machine.games[existingGameIndex], ...newGame };
        } else {
          // Agregar nuevo juego
          machine.games.push(newGame);
        }
      }
  
      // Actualizar el status de la máquina
      if (status !== undefined) {
        machine.status = status;
      }
  
      // Actualizar los providers de la máquina
      if (providers) {
        machine.providers = providers;
      }
  
      machine.updatedAt = new Date();
  
      // Guardar los cambios en la base de datos
      const updatedMachine = await machine.save();
  
      return NextResponse.json(
        {
          message: "Máquina Actualizada con Éxito",
          data: updatedMachine,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error al actualizar la máquina:", error);
      return NextResponse.json(
        {
          message: "Error al actualizar la máquina",
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
  
 
export async function DELETE(request: Request, { params }: { params: { id_machine: string } }) {
  try {
    await connectDB(); // Conectar a la base de datos

    // Eliminar la máquina de la colección `machines`
    const deletedMachine = await Machine.findOneAndDelete({ id_machine : params.id_machine });

    // Verificar si se encontró y eliminó la máquina
    if (!deletedMachine) {
      return NextResponse.json({ message: "Máquina no encontrada" }, { status: 404 });
    }

    // Actualizar las salas que contienen esta máquina en su lista `id_machine`
    const roomsToUpdate = await Room.find({ id_machine: params.id_machine });

    if (roomsToUpdate.length > 0) {
      // Iterar sobre las salas que tienen esta máquina y actualizarlas
      for (const room of roomsToUpdate) {
        const updatedIdMachines = room.id_machine.filter(id => id !== params.id_machine);
        await Room.findByIdAndUpdate(room._id, { id_machine: updatedIdMachines }, { new: true });
      }
    }

    return NextResponse.json({ message: "Máquina eliminada con éxito" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la máquina:", error);
    return NextResponse.json({ message: "Error al eliminar la máquina", error: error.message }, { status: 500 });
  }
}
