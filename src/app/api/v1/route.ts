import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

// GET ALL Machines and Their Balances
export async function GET() {
  try {
    await connectDB();

    // Obtiene todas las transacciones
    const transactions = await Transaction.find().sort({ user: 1, transaction: -1 });

    // Crear un objeto donde cada user es una clave con el balance más reciente
    const machineBalances = transactions.reduce((acc, transaction) => {
      const { user, balance } = transaction;
      if (!acc[user] || transaction.transaction > acc[user].transaction) {
        acc[user] = { balance, transaction: transaction.transaction };
      }
      return acc;
    }, {});

    const data = Object.keys(machineBalances).map(user => ({
      user,
      balance: machineBalances[user].balance,
    }));

    const simulatedResponse = data.length > 0 ? {
      status: "OK",
      code: 200,
      data
    } : {
      status: "No transactions found",
      data: []
    };

    return NextResponse.json(simulatedResponse, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      status: "Failed to get transactions",
      error: error.message,
    }, {
      status: 500,
    });
  }
}
