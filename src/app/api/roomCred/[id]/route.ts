import { NextApiRequest, NextApiResponse } from 'next';
import Room from '@/models/room'; // Importa tu modelo de sala
import Transaction from '@/models/transaction'; // Importa tu modelo de transacción
import User from '@/models/user'; // Importa tu modelo de usuario

// Exporta el método POST
export async function POST(req: NextApiRequest, { params }: { params: { id: string } }) {

  try {
    const { id } = params; // Obtiene la ID de los parámetros
    const { amount, currency, message, action, client  } = await req.json(); // Extrae el cuerpo de la solicitud

    // Encuentra la sala por ID
    const room = await Room.findById(id);
    if (!room) {
      return new Response(JSON.stringify({ message: 'Sala no encontrada' }), { status: 404 });
    }

    // Encuentra el usuario por ID
    const user = await User.findById(client); // Asegúrate de que se pase el userId en la solicitud
    if (!user) {
      return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404 });
    }

    // Verifica si el usuario tiene suficiente balance
    if (user.balance < amount) {
      return new Response(JSON.stringify({ message: 'Saldo insuficiente' }), { status: 400 });
    }

    // Actualiza el balance de la sala
    room.balance += amount;
    await room.save();

    // Resta el balance del usuario
    user.balance -= amount;
    await user.save();

    // Crea una nueva transacción
    const transaction = await Transaction.create({
      roomId: room._id,
      amount,
      currency,
      message,
      action,
    });

    return new Response(JSON.stringify({ message: 'Crédito aplicado correctamente', transaction }), { status: 200 });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return new Response(JSON.stringify({ message: 'Error al procesar la solicitud' }), { status: 500 });
  }
}
