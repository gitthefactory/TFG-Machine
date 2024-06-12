import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Client from "@/models/client";
import { ObjectId } from "mongoose";

//GET ALL CLIENT
export async function GET() {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todos los clientes con los datos del usuario asociado poblados
    const clientes = await Client.find();

    // Devolver la respuesta con los datos de los clientes
    return NextResponse.json({
      message: "Ok",
      data: clientes,
    }, {
      status: 200
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante el proceso
    return NextResponse.json({
      message: "Failed to get clients",
      error,
    }, {
      status: 500,
    });
  }
}

//CREATE  A NEW CLIENT
export async function POST(request: {
  json: () =>
    | PromiseLike<{
        nombreCompleto: any;
        email: any;
        telefono: any;
        empresa: any;
        pais: any;
        idioma: any;
        direccion: any;
        comuna: any;
        ciudad: any;
        status: any;
        password: any;
        typeProfile: ObjectId;
        tipoMoneda: any;
      }>
    | {
        nombreCompleto: any;
        email: any;
        telefono: any;
        empresa: any;
        pais: any;
        idioma: any;
        direccion: any;
        comuna: any;
        ciudad: any;
        status: any;
        password: any;
        typeProfile: ObjectId;
        tipoMoneda: any;
      };
}) {
  try {
    const {
      nombreCompleto,
      email,
      telefono,
      empresa,
      pais,
      idioma,
      direccion,
      comuna,
      ciudad,
      status,
      password,
      typeProfile,
      tipoMoneda 
      
    } = await request.json();

    const newClients = {
      nombreCompleto: nombreCompleto,
      email: email,
      telefono: telefono,
      empresa: empresa,
      pais: pais,
      idioma: idioma,
      direccion: direccion,
      comuna: comuna,
      ciudad: ciudad,
      status: status,
      password: password,
      typeProfile: typeProfile,
      tipoMoneda: tipoMoneda
    };

    //conetar a la BD

    await connectDB();
    await Client.create(newClients);
    return NextResponse.json(
      {
        message: "Cliente Creado con Exito¡",
        data: newClients,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to Create Client..",
        error,
      },
      {
        status: 500,
      }
    );
  }
}



//DELETE A CLIENT
export async function DELETE(request: { nextUrl: { searchParams: { get: (arg0: string) => any; }; }; }){
    try {
        const id = request.nextUrl.searchParams.get("_id");
        await connectDB();
        await  Client.findByIdAndDelete(id);
        
        return NextResponse.json(
            {
              message: "Cliente eliminado Satisfactoriamente",
            },
            { status: 200 }
          );
        
    } catch (error) {
        return NextResponse.json(
            {
              message: "Failed to Delete a Client",
              error,
            },
            {
              status: 500,
            }
          );
    }
}
