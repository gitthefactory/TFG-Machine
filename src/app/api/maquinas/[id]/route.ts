import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Machine from "@/models/machine";



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

//Update/EDITING a MACHINE
export async function PUT(request: any, { params: { id } }: any) {
    try {
      const {
        newNombre,
        newDescripcion,
        newStatus,
        newOperator,
        newClient,
        newRoom,
        games
      } = await request.json();
  
      // Conectar a la base de datos
      await connectDB();
  
      // Construir el objeto con los datos actualizados de la máquina
      const updatedMachineData = {
        nombre: newNombre,
        descripcion: newDescripcion,
        status: newStatus,
        operador: newOperator,
        cliente: newClient,
        sala: newRoom,
        games: games
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
  
  