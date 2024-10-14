import { NextResponse } from 'next/server';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { amount }: { amount: number } = await req.json();

    // 1. Buscar al usuario por su ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // 2. Verificar que el monto no exceda el límite de depósito (independiente del balance actual)
    if (amount > user.depositLimit) {
      return NextResponse.json({ message: 'Depósito excede el límite permitido' }, { status: 400 });
    }

    // 3. Actualizar el saldo del usuario
    user.balance += amount;
    await user.save();

    // 4. Crear la transacción
    const newTransaction = new Transaction({
      user: id,
      action: 'BALANCE',
      amount,
      balance: user.balance,
      message: `Creditación a usuario : ${user.nombreCompleto}`,
    });

    await newTransaction.save();

    // 5. Responder con los detalles del usuario y la transacción
    return NextResponse.json({
      message: 'Depósito exitoso',
      user: {
        balance: user.balance,
        depositLimit: user.depositLimit,
        user: user.nombreCompleto
      },
      transaction: newTransaction,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
