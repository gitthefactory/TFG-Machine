import { connectDB } from '@/libs/mongodb';
import ProviderModel from '@/models/providers'; // Ajusta la ruta según tu estructura de archivos
import GamesModel from '@/models/games';
import { NextResponse } from 'next/server';


export async function GET() {
    // Realizar el fetch a la nueva URL
    const res = await fetch('https://aggregator.casinoenruta.com/games-all?client_secret=9ffcfd63-e809-451c-9651-955c0622709d');
  
    // Verificar el estado de la respuesta
    if (!res.ok) {
      return new Response('Error al obtener los juegos', { status: res.status });
    }
  
    // Convertir la respuesta a JSON
    const games = await res.json();
  
    // Retornar la respuesta con los juegos y el encabezado Access-Control-Allow-Origin
    return new Response(JSON.stringify(games), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://aggregator.casinoenruta.com/'
      }
    });
  }
  

async function paraProvider (juegos) {
  try {
    for (const juego of juegos) {
      const { provider, provider_name } = juego;
      
      // Verifica si ya existe un juego con los mismos valores de provider y provider_name
      const juegoExistente = await ProviderModel.findOne({ provider, provider_name });

      if (!juegoExistente) {
        // Si no existe, crea un nuevo documento de juego y guárdalo en la base de datos
        const nuevoJuego = new ProviderModel({
          provider,
          provider_name,
          status: 1, // Define el estado según tus requisitos
          user: null // Define el usuario si es necesario
        });
        
        await nuevoJuego.save();
        // console.log(`Juego guardado exitosamente: ${provider_name}`);
      }
    }
    // console.log('Todos los juegos han sido procesados.');
  } catch (error) {
    console.error('Error al guardar los juegos:', error);
  }
}

async function obtenerYGuardarAmbos() {
  try {
    const response = await fetch('https://aggregator.casinoenruta.com/games-all?client_secret=9ffcfd63-e809-451c-9651-955c0622709d');
    if (!response.ok) {
      throw new Error('Error al obtener los juegos de la API');
    }
    const { data: { games } } = await response.json();
    await paraProvider(games);
    await ParaGames(games);
  } catch (error) {
    console.error('Error al obtener y guardar los juegos:', error);
  }
}



async function ParaGames(juegos: any[]) {
  try {
    for (const juego of juegos) {
      const { provider, id_machine, games } = juego;
      
      // Filtramos los juegos para obtener solo los del proveedor actual
      const juegosProveedor = juegos.filter((juego: any) => juego.provider === provider);
      
      // Verifica si ya existe un juego con el mismo proveedor
      const juegoExistente = await GamesModel.findOne({ provider });

      if (!juegoExistente) {
        // Si no existe, crea un nuevo documento de juego y guárdalo en la base de datos
        const nuevoJuego = new GamesModel({
          id_machine: " ",
          provider,
          status: 1,
          games: juegosProveedor // Pasamos solo los juegos del proveedor actual
        });
        
        await nuevoJuego.save();
        // console.log(`Juegos del proveedor ${provider} guardados exitosamente.`);
      } 
    }
    // console.log('Todos los juegos han sido procesados.');
  } catch (error) {
    console.error('Error al guardar los juegos:', error);
  }
}


export async function getProviders() {
  try {
    await connectDB();
    const proveedores = await ProviderModel.find();
    return NextResponse.json({
      message: "Ok",
      data: proveedores,
    }, {
      status: 200
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to get providers",
      error,
    }, {
      status: 500,
    });
  }
}


getProviders();

obtenerYGuardarAmbos();