

import { NextResponse } from "next/server";
import {connectDB} from "@/libs/mongodb";
import User from "@/models/user";
import ProfileType from "@/models/profileType";



//GET A USER WITH POPULATE FUNCTION
export async function GET() {
  try {
    // Conectar a la base de datos (si no lo has hecho ya)
    await connectDB();

    // Obtener todos los usuarios y poblar el campo 'typeProfile' con la información del tipo de perfil
    const usuarios = await User.find().populate('typeProfile');

    // Obtener los tipos de perfil para cada usuario
    const populatedUsuarios = await Promise.all(usuarios.map(async (usuario) => {
      const tipoPerfil = await ProfileType.findById(usuario.typeProfile);
      return {
        ...usuario.toJSON(),
        typeProfile: tipoPerfil
      };
    }));

    return NextResponse.json({
      message: "Ok",
      data: populatedUsuarios,
    }, {
      status: 200
    });
  } catch (error) {

  
    return NextResponse.json({
      message: "Failed to get users",
      error,
    }, {
      status: 500,
    });
  }
}



export async function POST(request: { json: () => Promise<{ 
  nombreCompleto: string; 
  email: string; 
  password: string; 
  status: number; 
  id_machine: string[]; 
  typeProfile: string; 
  games?: any[]; 
  client?: string; 
  contactNumber1: string; 
  contactNumber2?: string; 
  balance: number; // Agregar balance
  depositLimit: number; // Agregar depositLimit
}>; }) {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { 
      nombreCompleto, 
      email, 
      password, 
      status, 
      id_machine, 
      typeProfile, 
      games = [], 
      client, 
      contactNumber1, 
      contactNumber2,
      balance = 0, // Inicializar balance por defecto
      depositLimit = 0 // Inicializar depositLimit por defecto
    } = await request.json();

    // Conectar a la base de datos
    await connectDB();

    // Crear un nuevo usuario en base a los datos proporcionados
    const newUser = await User.create({
      nombreCompleto,
      email,
      password,
      status,
      id_machine,
      typeProfile,
      games,
      client,
      contactNumber1,
      contactNumber2,
      balance, // Guardar balance
      depositLimit // Guardar depositLimit
    });

    return NextResponse.json({
      message: "Usuario Creado con Éxito",
      data: newUser
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      message: "Error al crear el usuario",
      error,
    }, {
      status: 500,
    });
  }
}

//DELETE A USER
export async function DELETE(request: { nextUrl: { searchParams: { get: (arg0: string) => any; }; }; }){
  try {
      const id = request.nextUrl.searchParams.get("_id");
      await connectDB();
      await  User.findByIdAndDelete(id);
      
      return NextResponse.json(
          {
            message: "Usuario eliminado Satisfactoriamente",
          },
          { status: 200 }
        );
      
  } catch (error) {
      return NextResponse.json(
          {
            message: "Failed to Delete a User",
            error,
          },
          {
            status: 500,
          }
        );
  }
}