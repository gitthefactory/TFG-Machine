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


  export async function PUT(request: any, { params: { id } }: any) {
    try {
      const { newStatus, newOperator, newClient, games } = await request.json();
  
      // Conectar a la base de datos
      await connectDB();
  
      // Construir el objeto con los datos actualizados de la máquina
      const updatedMachineData: any = {
        status: newStatus,
        client: newClient,
        games: games,
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