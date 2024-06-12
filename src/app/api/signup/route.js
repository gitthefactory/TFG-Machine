import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB();

    const { nombreCompleto, email, password } = await req.json();
    const exists = await User.findOne({ $or: [{ email }] });
    if (exists) {
      return NextResponse.json(
        { message: "Correo ya en uso" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validar y asignar typeProfile por defecto si es null
    let typeProfile = null; // Tipo por defecto
    if (
      typeof req.body.typeProfile === "undefined" ||
      req.body.typeProfile === null
    ) {
      typeProfile = "660ebaa7b02ce973cad66553"; // Asigna el tipo por defecto si es null o no está definido
    } else {
      typeProfile = req.body.typeProfile; // Usa el tipo proporcionado si está definido
    }

    // Crear el usuario con typeProfile asignado
    await User.create({
      nombreCompleto,
      email,
      password: hashedPassword,
      typeProfile,
    });

    return NextResponse.json(
      { message: "Usuario registrado" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en Catch route api signup:", error); // Agrega este registro de error
    return NextResponse.json(
      { message: "Error en Catch route api signup" },
      { status: 500 }
    );
  }
}
