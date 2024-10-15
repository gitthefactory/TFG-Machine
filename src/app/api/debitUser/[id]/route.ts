import { NextResponse } from 'next/server';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { amount }: { amount: number } = await req.json();

    // Verificar que el monto sea positivo
    if (amount <= 0) {
      return NextResponse.json({ message: 'El monto debe ser mayor a 0' }, { status: 400 });
    }

    // 1. Buscar al usuario por su ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // 2. Verificar que el usuario tenga saldo suficiente para debitar
    if (user.balance < amount) {
      return NextResponse.json({ message: 'Saldo insuficiente' }, { status: 400 });
    }

    // 3. Actualizar el saldo del usuario
    user.balance -= amount;
    await user.save();

    // 4. Crear la transacción
    const newTransaction = new Transaction({
      user: id,
      action: 'DEBIT',
      amount,
      balance: user.balance,
      message: `Débito exitoso para el usuario: ${user.nombreCompleto}`,
    });

    await newTransaction.save();

    // 5. Responder con los detalles del usuario y la transacción
    return NextResponse.json({
      message: 'Débito exitoso',
      user: {
        balance: user.balance,
        depositLimit: user.depositLimit,
      },
      transaction: {
        id: newTransaction._id,
        action: newTransaction.action,
        amount: newTransaction.amount,
        balance: newTransaction.balance,
      },
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
