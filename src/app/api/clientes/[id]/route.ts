import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Client from "@/models/client";



// OBTENER TODOS LOS CLIENTES
export async function GET() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todos los clientes de la base de datos
    const clients = await Client.find({});

    return NextResponse.json({
      message: "Clientes recuperados exitosamente",
      data: clients
    }, {status: 200});
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al recuperar los clientes",
        error,
      },
      {
        status: 500,
      }
    );
  }
}


//ACTUALIZAR
export async function PUT(request: any, { params: { id } }: any) {
  try {
    const {
      newNombreCompleto: nombreCompleto,
      newEmail: email,
      newProfileType: profileType,
      newPassword: password,
      newStatus: status,
      newId_machine: id_machine,
      newTelefono: telefono,
      newEmpresa: empresa,
      newPais: pais,
      newIdioma: idioma,
      newDireccion: direccion,
      newComuna: comuna,
      newCiudad: ciudad,
      user: usuarioSeleccionado,
    } = await request.json();

    // Conecta a la base de datos
    await connectDB();

    // Actualiza el cliente utilizando el método findByIdAndUpdate
    await Client.findByIdAndUpdate(id, {
      nombreCompleto: nombreCompleto,
      email: email,
      password: password,
      status: status,
      profileType: profileType,
      id_machine: id_machine,
      telefono: telefono,
      empresa: empresa,
      pais: pais,
      idioma: idioma,
      direccion: direccion,
      comuna: comuna,
      ciudad: ciudad, 
    });

    return NextResponse.json(
      {
        message: "Cliente Actualizado con Éxito",
        data: {
          nombreCompleto: nombreCompleto,
          email: email,
          profileType: profileType,
          password: password,
          status: status,
          id_machine: id_machine,
          telefono: telefono,
          empresa: empresa,
          pais: pais,
          idioma: idioma,
          direccion: direccion,
          comuna: comuna,
          ciudad: ciudad,
          status: status,
          user: usuarioSeleccionado
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al actualizar el cliente",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
