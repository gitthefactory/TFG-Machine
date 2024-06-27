"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "../CardDataStats";
import getUsers from "@/controllers/getUsers";
import getClients from "@/controllers/getClients";
import getOperators from "@/controllers/getOperators";
import getRooms from "@/controllers/getRooms";
import getMachines from "@/controllers/getMachines";
import getGames from "@/controllers/getGames";
import Client from "@/models/client";
import { FaLaptop, FaServer, FaUser, FaShop, FaUserGroup } from "react-icons/fa6";
import getSessionData from "@/controllers/getSession"; 


interface Game {
  id: number;
  name: string;
  provider: number;
  category: string;
  selected: boolean;
}
const provider = {
  29: "Belatra Gaming",
  68: "Bgaming",
  // Añade más proveedores según sea necesario
};

const numberOfProviders = Object.keys(provider).length;
//console.log("Número de proveedores:", numberOfProviders);


interface User {
  id: number;
  name: string;
  email: string;
}

enum LoadingState {
  Loading,
  Loaded,
  Error,
}


const ECommerce: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [operators, setOperators] = useState<[]>([]);
  const [rooms, setRooms] = useState<[]>([]);
  const [machines, setMachines] = useState<[]>([]);

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.Loading
  );
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers("", 0); // Assuming getUsers returns an array of users
        setUsers(userData);
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };

    fetchUsers();
  }, []);
  //console.log(users.length)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientData = await getClients("", 0);
        setClients(clientData);
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const operatorData = await getOperators("", 0);
        setOperators(operatorData);
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };
    fetchOperators();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomData = await getRooms("", 0);
        setRooms(roomData);
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const machineData = await getMachines("", 0);
        setMachines(machineData);
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };
    fetchMachines();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gameData = await getGames("", 0);
        setGames(gameData);
        //console.log(gameData.games.length)
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };
    fetchGames();
  }, []);

  const [user, setUser] = useState<any>(null); // Cambiado para que `user` pueda ser de cualquier tipo

  useEffect(() => {
    const userData = async () => {
      const sessionData = await getSessionData(); // Llama a la función getSessionData para obtener la sesión
      setUser(sessionData.data.user?.typeProfile); // Establece el tipo de perfil del usuario en `user`
    };

    userData();
  }, []);


  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* {user === "660ebaa7b02ce973cad66550" && (
          <CardDataStats title="Total Usuarios" total={parseFloat(users.length)} >
            <FaUserGroup />
          </CardDataStats>
        )} */}
        {user === "660ebaa7b02ce973cad66550" && (
          <CardDataStats title="Total Clientes" total={users.length} >
            <FaUserGroup />
          </CardDataStats>
        )}
        <CardDataStats title="Total Operadores" total={operators.length} >
          <FaUser />
        </CardDataStats>
        <CardDataStats title="Total Salas" total={rooms.length} >
          <FaShop  />
        </CardDataStats>
        <CardDataStats title="Total Máquinas" total={machines.length} >
        <FaLaptop />
        </CardDataStats>
        {user === "660ebaa7b02ce973cad66550" && (
          <CardDataStats title="Total Proveedores" total={numberOfProviders} >
            <FaServer />
          </CardDataStats>
        )}
      </div>
    </>
  );
};

export default ECommerce;