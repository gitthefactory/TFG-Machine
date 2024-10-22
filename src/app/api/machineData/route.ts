import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Esta función maneja las solicitudes POST
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_machine, token } = body;

    // Verifica que los datos necesarios estén presentes
    if (!id_machine || !token) {
      return NextResponse.json({ message: 'Faltan datos necesarios' }, { status: 400 });
    }

    // Ruta donde se guardará el archivo JSON
    const filePath = path.join(process.cwd(), 'data', 'machineData.json');

    // Crear el objeto que se va a escribir en el archivo
    const machineData = {
      id_machine,
      token,
      updatedAt: new Date().toISOString(),
    };

    // Guardar el archivo JSON
    fs.writeFileSync(filePath, JSON.stringify(machineData, null, 2));

    // Respuesta exitosa
    return NextResponse.json({ message: 'Datos guardados correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// Manejo de otros métodos HTTP no permitidos
export function GET() {
  return NextResponse.json({ message: 'Method GET Not Allowed' }, { status: 405 });
}
