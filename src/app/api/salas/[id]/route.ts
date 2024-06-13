import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Room from "@/models/room";


//GET A ONE MACHINE
export async function GET(request: any, { params: { id } }: any) {
    try {
      //conetar a BD
      await connectDB();
      //get data using model
      const salas = await Room.findOne({ _id: id });
      return NextResponse.json(
        {
          message: "Ok",
          data: salas,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Failed to fecth a Room",
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
      const {
        newNombre,
        newStatus,
        newPais,
        newCiudad,
        newComuna,
        newClient,
        id_machine,
      } = await request.json();
  
      await connectDB();
  
      const updatedMachineData = {
        nombre: newNombre,
        status: newStatus,
        pais: newPais,
        ciudad: newCiudad,
        comuna: newComuna,
        client: newClient,
        id_machine: id_machine,
      };
  
      const updatedMachine = await Room.findByIdAndUpdate(id, updatedMachineData, { new: true });
  
      // Asegúrate de que id_machine esté incluido en la respuesta
      updatedMachine.id_machine = id_machine;
  
      return NextResponse.json(
        {
          message: "Sala Actualizada con Éxito",
          data: updatedMachine,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Error al actualizar Sala",
          error,
        },
        {
          status: 500,
        }
      );
    }
  }