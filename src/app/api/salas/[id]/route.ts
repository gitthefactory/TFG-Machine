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
      newDescripcion,
      newRuta,
      newStatus,
      newPais,
      newCiudad,
      newComuna,
      newOperator,
      newClient,
      juegos // Agregamos los juegos aquí
    } = await request.json();

    // Conectar a la base de datos
    await connectDB();

    // Construir el objeto con los datos actualizados de la máquina
    const updatedMachineData = {
      nombre: newNombre,
      descripcion: newDescripcion,
      ruta: newRuta,
      status: newStatus,
      pais: newPais,
      ciudad: newCiudad,
      comuna: newComuna,
      operador: newOperator,
      cliente: newClient,
      games: juegos // Agregamos los juegos aquí
    };

    // Actualizar la máquina en la base de datos
    const updatedMachine = await Room.findByIdAndUpdate(id, updatedMachineData, { new: true });

    // Si el usuario asociado ha cambiado, puedes realizar una acción adicional aquí

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
