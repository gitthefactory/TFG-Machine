// "use client"


// import React, { useEffect, useState } from 'react'
// import io from 'socket.io-client'

// const API_URL = 'http://localhost:3001/'
// const socket = io(API_URL, { autoConnect: false })

// const RealtimeView = () => {
//   const [views, setViews] = useState(0)
//   const [isChecked, setIsChecked] = useState(false) // Nuevo estado para el checkbox

//   useEffect(() => {
//     socket.connect()

//     socket.on("count", (count) => {
//       setViews(count)
//     })

//     // Escuchar cambios en el checkbox desde otras pestañas
//     socket.on("checkboxChange", (isCheckedFromOtherTab) => {
//       setIsChecked(isCheckedFromOtherTab)
//     })

//     return () => {
//       socket.disconnect()
//     }
//   }, [])

//   // Manejar cambios en el checkbox y emitir evento a través del socket
//   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { checked } = event.target
//     setIsChecked(checked)
//     socket.emit("checkboxChange", checked) // Emitir evento con el nuevo estado
//   }

//   return (
//     <div>
//       <h2 className='text-[100px] md:text-[200px] lg:text-[300px] flex items-center text-center font-extrabold'>
//         <span className="relative flex h-5 w-5 mr-4">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//           <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
//         </span>
//         <span className='leading-[80px] md:leading-[150px] lg:leading-[220px]'>{views}<span className='block text-base md:text-2xl lg:text-4xl'>Online</span></span>
//       </h2>

//       {/* Agregar el checkbox */}
//       <input 
//         type="checkbox" 
//         checked={isChecked} 
//         onChange={handleCheckboxChange} 
//       />
//       <label htmlFor="checkbox">Sincronizar Checkbox</label>
//     </div>
//   )
// }

// export default RealtimeView