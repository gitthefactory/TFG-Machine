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
      const { newStatus, newOperator, newClient, games, providers } = await request.json();
  
      // Conectar a la base de datos
      await connectDB();
  
      // Construir el objeto con los datos actualizados de la máquina
      const updatedMachineData: any = {
        status: newStatus,
        client: newClient,
        games: games,
        providers: providers, // Agregar el campo providers
        updatedAt: new Date(), // Actualizar el campo updatedAt
      };
  
      // Agregar newOperator solo si está definido
      if (newOperator !== undefined) {
        updatedMachineData.operator = newOperator;
      }
  
      console.log("Datos a actualizar:", updatedMachineData);
  
      // Actualizar la máquina en la base de datos
      const updatedMachine = await Machine.findByIdAndUpdate(id, updatedMachineData, { new: true });
  
      console.log("Máquina actualizada:", updatedMachine);
  
      // Verificar si la máquina se actualizó correctamente
      if (!updatedMachine) {
        return NextResponse.json(
          {
            message: "Máquina no encontrada",
          },
          { status: 404 }
        );
      }
  
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
