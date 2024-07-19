import { NextApiRequest, NextApiResponse } from 'next';

function generateTransactionId(): string {
  const randomId = Math.floor(Math.random() * 10 ** 16).toString();
  return randomId.padStart(16, '0');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount } = req.body;

    // Lógica para obtener el saldo actual (aquí deberías obtener el saldo desde la base de datos)
    const saldoActual = 550.25;

    // Lógica para acreditar la transacción
    const nuevoSaldo = saldoActual + amount;
    const transactionId = generateTransactionId();

    const creditResponse = {
      status: 'OK',
      code: 200,
      data: {
        transaction: transactionId,
        balance: nuevoSaldo
      }
    };

    return res.status(200).json(creditResponse);
  } else {
    return res.status(405).json({ status: 'ERROR', code: 405, message: 'Método no permitido' });
  }
}
