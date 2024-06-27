// const API_BASE_URL = "http://localhost:3000/api/maquinas";

// const enviargamessAMaquina = async (maquinaId, games) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/${maquinaId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ games }), // Asegúrate de enviar los gamess aquí
//     });

//     if (!response.ok) {
//       throw new Error("Error al enviar gamess a la máquina");
//     }

//     const responseData = await response.json();
//     console.log(`games enviados a la máquina ${maquinaId}:`, responseData);

//     if (!responseData.data || !responseData.data.games) {
//       throw new Error("La respuesta no contiene datos de games actualizados");
//     }

//     console.log("games actualizados en la máquina:", responseData.data.games);
//   } catch (error) {
//     console.error(`Error al enviar gamess a la máquina ${maquinaId}:`, error);
//     throw error;
//   }
// };

// export default enviargamessAMaquina;
