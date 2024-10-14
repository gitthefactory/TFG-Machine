import { NextApiRequest, NextApiResponse } from 'next';
import Room from '@/models/room'; // Importa tu modelo de sala

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;



  switch (method) {
    case 'GET':
      try {
        const rooms = await Room.find();
        return res.status(200).json({ data: rooms });
      } catch (error) {
        console.error('Error al obtener las salas:', error);
        return res.status(500).json({ message: 'Error al obtener las salas' });
      }
    // Puedes añadir más métodos si es necesario
    default:
      return res.status(405).json({ message: 'Método no permitido' });
  }
}
