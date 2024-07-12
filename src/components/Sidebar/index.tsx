import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import getSessionData from "@/controllers/getSession";
import { FaLaptop, FaServer, FaUser, FaShop, FaUserGroup, FaHouse, FaUserPlus, FaDice } from "react-icons/fa6";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const sidebar = useRef<any>(null);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = async () => {
      const sessionData = await getSessionData();
      setUser(sessionData.data.user?.typeProfile);
    };

    userData();
  }, []);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !target) return;
      if (!sidebarOpen || sidebar.current.contains(target)) return;
      setSidebarOpen(false);
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", String(sidebarOpen));
    document.querySelector("body")?.classList.toggle("sidebar-expanded", sidebarOpen);
  }, [sidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
    }`}
    
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image
            width={176}
            height={32}
            src="/images/logo/logo1.png"
            alt="Logo"
            priority
          />
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/' ? 'bg-graydark dark:bg-meta-4' : ''}`}
                >
                 <FaHouse  />
                  Dashboard
                </Link>
              </li>
              {/* {user === "660ebaa7b02ce973cad66550" && (
                <li>
                  <Link
                    href="/dashboard/usuarios/crear"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("usuarios") &&
                      "bg-graydark dark:bg-meta-4"
                      }`}
                  >
                    <FaUserPlus />
                    Usuarios
                  </Link>
                </li>
              )} */}
              {user === "660ebaa7b02ce973cad66550" && (
                <li>
                  <Link
                    href="/dashboard/clientes"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("clientes") &&
                      "bg-graydark dark:bg-meta-4"
                      }`}
                  >
                    <FaUserGroup />
                    Clientes
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/dashboard/salas"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("salas") &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
                <FaShop />
                  Salas
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/maquinas"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("maquinas") &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
             <FaLaptop />
                  Máquinas
                </Link>
              </li>
               <li>
                <Link
                  href="/dashboard/operadores"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("operadores") &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
                 <FaUser />
                  Operadores
                </Link>
              </li>
              {user === "660ebaa7b02ce973cad66550" && (
                <li>
                  <Link
                    href="/dashboard/proveedores"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("proveedores") &&
                      "bg-graydark dark:bg-meta-4"
                      }`}
                  >
                  <FaServer />
                    Proveedores
                  </Link>
                </li>
              )}
              {/* {user === "660ebaa7b02ce973cad66550" && (
                <li>
                  <Link
                    href="/dashboard/juegos"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("juegos") &&
                      "bg-graydark dark:bg-meta-4"
                      }`}
                  >
                 <FaDice />
                    Juegos
                  </Link>
                </li>
              )} */}
                {/* {user === "660ebaa7b02ce973cad66551" && (
                <li>
                  <Link
                    href="/dashboard/providersClients"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("providersClients") &&
                      "bg-graydark dark:bg-meta-4"
                      }`}
                  >
                  <FaServer />
                    Juegos / Proveedores
                  </Link>
                </li>
             )} */}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
