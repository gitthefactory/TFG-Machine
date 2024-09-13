"use client";
import React, { useEffect, useState } from "react";
import CardDataStats from "../CardDataStats";
import getUsers from "@/controllers/getUsers";
import getOperators from "@/controllers/getOperators";
import getRooms from "@/controllers/getRooms";
import getMachines from "@/controllers/getMachines";
import getGames from "@/controllers/getGames";

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
  12 : "Booming Games",
  87 : "Aspect Gaming"
  // Añade más proveedores según sea necesario
};

const numberOfProviders = Object.keys(provider).length;

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserProfile {
  _id: string;
  typeProfile: string;
}

interface UserData {
  _id: string;
  email: string;
  nombreCompleto: string;
  games: any[];
  status: number;
  typeProfile: UserProfile;
  id_machine: string[];
  client: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

enum LoadingState {
  Loading,
  Loaded,
  Error,
}

const ECommerce: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.Loading
  );
  const [user, setUser] = useState<any>(null); // Cambiado para que `user` pueda ser de cualquier tipo

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers("", 0);
        setUsers(userData);
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };
    fetchUsers();
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
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.Error);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const userData = async () => {
      const sessionData = await getSessionData();
      setUser(sessionData.data.user?.typeProfile);
    };
    userData();
  }, []);

  // Filtrar operadores por _id especificado
  const filteredOperators = operators.filter(
    (operator: any) => operator.typeProfile._id === "660ebaa7b02ce973cad66552"
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {user === "660ebaa7b02ce973cad66550" && (
          <CardDataStats title="Total Clientes" total={users.length}>
            <FaUserGroup />
          </CardDataStats>
        )}
        <CardDataStats title="Total Operadores" total={filteredOperators.length}>
          <FaUser />
        </CardDataStats>
        <CardDataStats title="Total Salas" total={rooms.length}>
          <FaShop />
        </CardDataStats>
        <CardDataStats title="Total Máquinas" total={machines.length}>
          <FaLaptop />
        </CardDataStats>
        {user === "660ebaa7b02ce973cad66550" && (
          <CardDataStats title="Total Proveedores" total={numberOfProviders}>
            <FaServer />
          </CardDataStats>
        )}
      </div>
    </>
  );
};

export default ECommerce;
