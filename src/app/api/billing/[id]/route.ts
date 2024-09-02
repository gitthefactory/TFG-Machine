import { NextResponse } from 'next/server';
import { connectDB } from '@/libs/mongodb';
import Transaction from '@/models/transaction';
import Machine from '@/models/machine';

// GET Balance and sessionToken for a specific machine (by user ID)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;

    // Obtener las cookies de la solicitud
    const cookies = request.headers.get('cookie');
    let sessionToken = null;

    // Extraer el session-token de las cookies
    if (cookies) {
      const cookiesArray = cookies.split(';').map(cookie => cookie.trim());
      const sessionCookie = cookiesArray.find(cookie => cookie.startsWith('next-auth.session-token='));

      if (sessionCookie) {
        sessionToken = sessionCookie.split('=')[1];
      }
    }

    // Si no se encontró el sessionToken, devolver un error
    if (!sessionToken) {
      return NextResponse.json({
        status: 'Failed',
        message: 'Session token is missing',
      }, { status: 401 }); // 401 Unauthorized
    }

    // Buscar las transacciones para el usuario específico
    const transactions = await Transaction.find({ user: id }).sort({ transaction: -1 });

    // Si no hay transacciones, devolver balance 0
    let balance = 0;
    if (transactions.length > 0) {
      balance = transactions[0].balance;
    }

    return NextResponse.json({
      status: 'OK',
      code: 200,
      data: {
        user: id,
        balance,
        sessionToken // Devuelve el session-token encontrado en las cookies
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Failed to get transactions',
      error: error.message,
    }, { status: 500 });
  }
}
