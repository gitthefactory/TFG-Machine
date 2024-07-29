import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Providers from '@/models/providers';

export async function GET(request: any, { params: { id } }: any) {
    try {
      await connectDB();
      const provider = await Providers.findOne({ _id: id });
      if (!provider) {
        return NextResponse.json(
          {
            message: "Provider not found",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          message: "Ok",
          data: provider,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Failed to fetch provider",
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }


  //PRUEBA DE PUT PARA PROVEEDORES

  // export async function PUT(request, { params: { id } }) {
  //   try {
  //     const { status } = await request.json(); // Solo obtenemos el campo 'status' del cuerpo JSON
  
  //     await connectDB();
  
  //     const provider = await Providers.findById(id);
  
  //     if (!provider) {
  //       return NextResponse.json(
  //         {
  //           message: "Game not found",
  //         },
  //         { status: 404 }
  //       );
  //     }
  
  //     // Actualizamos el estado del juego
  //     provider.status = status;
  
  //     const updatedGame = await provider.save();
  
  //     return NextResponse.json(
  //       {
  //         message: "Estado de provider actualizado con éxito",
  //         data: updatedGame,
  //       },
  //       { status: 200 }
  //     );
  //   } catch (error) {
  //     return NextResponse.json(
  //       {
  //         message: "Error al actualizar el estado del provider",
  //         error: error.message,
  //       },
  //       {
  //         status: 500,
  //       }
  //     );
  //   }
  // }

  export async function PUT(request: any, { params: { id } }: any) {
    try {
      const {
      
        status,
      

      } = await request.json();
  
      await connectDB();
  
      const updatedMachineData = {
       
        status,
      };
  
      const updatedMachine = await Providers.findByIdAndUpdate(id, updatedMachineData, { new: true });
  
      // Asegúrate de que id_machine esté incluido en la respuesta
      // updatedMachine.id_machine = id_machine;
  
      return NextResponse.json(
        {
          message: "Proveedor Actualizada con Éxito",
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
  