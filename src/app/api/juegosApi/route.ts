import GamesModel from '@/models/games';
import { NextResponse } from 'next/server';
import { connectDB } from '@/libs/mongodb';

//GET ALL MACHINE
export async function GET() {
    try {
      // Conectar a la base de datos
      await connectDB();
  
      // Obtener todos los clientes con los datos del usuario asociado poblados
      const juegos = await GamesModel.find();
  
      // Devolver la respuesta con los datos de los clientes
      return NextResponse.json({
        message: "Ok",
        data: juegos,
      }, {
        status: 200
      });
    } catch (error) {
      // Manejar cualquier error que pueda ocurrir durante el proceso
      return NextResponse.json({
        message: "Failed to get juegos",
        error,
      }, {
        status: 500,
      });
    }
  }



//CREAR PROVEEDORES
export async function POST(request: { json: () => PromiseLike<{ provider_name: string; provider: number; games: string[]; status: boolean; img: string; }> }) {
  try {
    const { provider_name, provider, games, status, img } = await request.json();

    // Conecta a la base de datos
    await connectDB();

    // Crea un nuevo proveedor de juegos en base a los datos proporcionados
    const newGameProvider = await GamesModel.create({
      provider_name: provider_name,
      provider: provider,
      games: games,
      status: status,
      img: img,
 
    });

    return NextResponse.json({
      message: "Proveedor de Juegos Creado con Éxito",
      data: newGameProvider
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear el proveedor de juegos:", error);
    return NextResponse.json({
      message: "Error al crear el proveedor de juegos",
      error,
    }, {
      status: 500,
    });
  }
}

