import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Operator from "@/models/operator";

// GET A ONE OPERATOR
export async function GET(request: any, { params: { id } }: any) {
  try {
    // Conectar a la base de datos
    await connectDB();
    // Obtener datos utilizando el modelo
    const operador = await Operator.findOne({ _id: id });
    return NextResponse.json(
      {
        message: "Ok",
        data: operador,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al obtener un operador",
        error,
      },
      {
        status: 500,
      }
    );
  }
}

// ACTUALIZAR
export async function PUT(request: any, { params: { id } }: any) {
  try {
    const {
      newTelefono: telefono,
      newEmpresa: empresa,
      newPais: pais,
      newIdioma: idioma,
      newDireccion: direccion,
      newComuna: comuna,
      newCiudad: ciudad,
      newStatus: status,
      user: usuarioSeleccionado,
      client: clienteSeleccionado
    } = await request.json();

    // Conecta a la base de datos
    await connectDB();

    // Actualiza el operador utilizando el método findByIdAndUpdate
    const updatedOperator = await Operator.findByIdAndUpdate(id, {
      telefono: telefono,
      empresa: empresa,
      pais: pais,
      idioma: idioma,
      direccion: direccion,
      comuna: comuna,
      ciudad: ciudad,
      status: status,
      user: usuarioSeleccionado,
      client: clienteSeleccionado
    }, { }); // `new: true` devuelve el documento actualizado

    // Verifica si la actualización fue exitosa
    if (!updatedOperator) {
      return NextResponse.json(
        {
          message: "Operador no encontrado",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Operador Actualizado con Éxito",
        data: updatedOperator
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al actualizar el Operador",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
