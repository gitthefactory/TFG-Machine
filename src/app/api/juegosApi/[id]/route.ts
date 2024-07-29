import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Games from "@/models/games"

//GET A ONE JUEGO
export async function GET(request: any, { params: { id } }: any) {
    try {
      //conetar a BD
      await connectDB();
      //get data using model
      const games = await Games.findOne({ _id: id });
      return NextResponse.json(
        {
          message: "Ok",
          data: games,
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
    const { status } = await request.json();
    console.log("Datos recibidos:", { status });

    await connectDB();

    const game = await Games.findOneAndUpdate(
      { "games.id": parseInt(id) }, 
      { $set: { "games.$.status": status } }, 
      { new: true }
    );

    if (!game) {
      return NextResponse.json(
        {
          message: "Error al actualizar el juego",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Estado de juego actualizado con éxito",
        data: game,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en la actualización del estado del juego:", error);
    return NextResponse.json(
      {
        message: "Error en la actualización del estado del juego",
      },
      { status: 500 }
    );
  }
}
