import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import Client from "@/models/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
//import para probar jwt

import { getToken } from 'next-auth/jwt';

//definicion de jwt const




// Definir el proveedor de credenciales para el inicio de sesión con correo electrónico y contraseña
const emailProvider = CredentialsProvider({
  name: "Credentials",
  id: "credentials",
  credentials: {
    email: { label: "Email", type: "text", placeholder: "jsmith" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    await connectDB();
    const userFound = await User.findOne({
      email: credentials?.email,
    }).select("+password");

    if (!userFound) throw new Error("Invalid credentials");

    const passwordMatch = await bcrypt.compare(
      credentials!.password,
      userFound.password
    );

    if (!passwordMatch) throw new Error("Invalid credentials");

    // Agregar el campo 'nombreCompleto' al objeto de usuario devuelto
    return {
      ...userFound.toObject(),
      name: userFound.nombreCompleto // Asegúrate de que el modelo de usuario tenga el campo 'nombreCompleto'
    };
  },
});

// Definir el proveedor de credenciales para el inicio de sesión con ID de máquina y contraseña
const machineProvider = CredentialsProvider({
  name: "CredentialsMaquina",
  id: "credentialsmaquina",
  credentials: {
    id_machine: { label: "ID Machine", type: "text", placeholder: "Ingrese el ID de la máquina" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    await connectDB();
    const userFound = await User.findOne({
      id_machine: credentials?.id_machine,
    }).select("+password");

    if (!userFound) throw new Error("Invalid credentials");

    const passwordMatch = await bcrypt.compare(
      credentials!.password,
      userFound.password
    );

    if (!passwordMatch) throw new Error("Invalid credentials");

    // Agregar el campo 'nombreCompleto' al objeto de usuario devuelto
    return {
      ...userFound.toObject(),
      name: userFound.nombreCompleto // Asegúrate de que el modelo de usuario tenga el campo 'nombreCompleto'
    };
  },
});

// PARA CLIENTES

const clientProvider = CredentialsProvider({
  name: "CredentialsClient",
  id: "credentialsclient",
  credentials: {
    email: { label: "Email", type: "text", placeholder: "correo@ejemplo.com" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    await connectDB();
    const clientFound = await Client.findOne({
      email: credentials?.email,
    }).select("+password");

    if (!clientFound) throw new Error("Invalid credentials");

    const passwordMatch = await bcrypt.compare(
      credentials!.password,
      clientFound.password
    );

    if (!passwordMatch) throw new Error("Invalid credentials");

    // Elimina la línea que agrega nombreCompleto al objeto devuelto
    return clientFound.toObject();
  },
});




// Combinar las configuraciones de los proveedores
const handlers = NextAuth({
  providers: [emailProvider, machineProvider, clientProvider],
  pages: {
    signIn: "/signin", 
    maquinas: "/maquinas", 
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  events: {
    async signOut(message) {
      // Elimina el token de sesió
      const token = await getToken ({req: message.req});
      if (token) {
        message.res.setHeader('Set-Cookie', 'next-auth.session-token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax');
      }
    },
  },
});

async function handler(req, res) {
  await signOut({ redirect: false, callbackUrl: '/' });
  res.status(200).end();
}

export default handler;

export const GET = handler;
export const POST = handler;
