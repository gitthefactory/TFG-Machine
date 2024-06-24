import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";

//GET A ONE USER
export async function GET(request: any, { params: { id } }: any) {
  try {
    //conetar a BD
    await connectDB();
    //get data using model
    const usuario = await User.findOne({ _id: id });
    return NextResponse.json(
      {
        message: "Ok",
        data: usuario,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fecth a User",
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
      nombreCompleto,
      email,
      profileType,
      password,
      status,
      id_machine, // Los nuevos id_machine a añadir
      games,
    } = await request.json();

    // Conecta a la base de datos
    await connectDB();

    // Actualiza el usuario utilizando el método findByIdAndUpdate
    await User.findByIdAndUpdate(id, {
      nombreCompleto: nombreCompleto,
      email: email,
      password: password,
      status: status,
      profileType: profileType, 
      $addToSet: { id_machine: { $each: id_machine } }, // Agrega los nuevos id_machine
      games: games,
    });

    return NextResponse.json(
      {
        message: "Usuario Actualizado con Éxito",
        data: {
          nombreCompleto: nombreCompleto,
          email: email,
          profileType: profileType,
          password: password,
          status: status,
          id_machine: id_machine,
          games: games,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al actualizar el usuario",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
