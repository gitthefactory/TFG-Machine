import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Operator from "@/models/operator";
import { getIO } from "@/app/api/socket/socket";


//GET A ONE OPERATOR
export async function GET(request: any, { params: { id } }: any) {
    try {
      // Conectar a la base de datos (asegúrate de que esta función esté disponible)
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


  //ACTUALIZAR
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
  
      // Actualiza el cliente utilizando el método findByIdAndUpdate
      await Operator.findByIdAndUpdate(id, {
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
      });

      const io = getIO();
    
    // Emite el evento de actualización
    io.emit('operatorUpdated', updatedOperator);
  
      return NextResponse.json(
        {
          message: "Operador Actualizado con Éxito",
          data: {
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
          }
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
  
  