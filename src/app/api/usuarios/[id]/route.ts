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
      id_machine,
      games,
    } = await request.json();

    // Conecta a la base de datos
    await connectDB();

    // Construye el objeto de actualización
    const updateData: any = {};

    if (nombreCompleto !== undefined) updateData.nombreCompleto = nombreCompleto;
    if (email !== undefined) updateData.email = email;
    if (profileType !== undefined) updateData.profileType = profileType;
    if (password !== undefined) updateData.password = password;
    if (status !== undefined) updateData.status = status;
    if (games !== undefined) updateData.games = games;

    // Agrega los nuevos id_machine si se proporcionan
    if (id_machine !== undefined && Array.isArray(id_machine)) {
      updateData.$addToSet = { id_machine: { $each: id_machine } };
    }

    // Actualiza el usuario utilizando el método findByIdAndUpdate
    await User.findByIdAndUpdate(id, updateData);

    return NextResponse.json(
      {
        message: "Usuario Actualizado con Éxito",
        data: updateData,
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
