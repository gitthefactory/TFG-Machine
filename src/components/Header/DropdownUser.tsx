import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import getUser from "@/controllers/getSession"; 
import { FaAngleDown, FaWhmcs, FaArrowRightFromBracket } from "react-icons/fa6";

//import de signOut
import {signOut} from 'next-auth/react';


const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser();
      if (response.status === 200) {
        setUser(response.data.user);
      }
    };

    fetchUser();
  }, []);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: '/' });
    setUser(null); // Clear user state after signing out
    document.cookie = 'next-auth.session-token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax'; // Elimina cookie
    window.location.reload ();
  };

  return (
    <div className="relative">
     <Link
  ref={trigger}
  onClick={() => setDropdownOpen(!dropdownOpen)}
  className="flex items-center gap-4"
  href="#"
>
{user && (
  
  <span className="hidden text-right lg:block">
    
    <span className="block text-sm font-medium text-black dark:text-white">
      {user.typeProfile === "660ebaa7b02ce973cad66550" ? "Master" : ""}
      {user.typeProfile === "660ebaa7b02ce973cad66551" ? "Cliente" : ""}
      {user.typeProfile === "660ebaa7b02ce973cad66552" ? "Operador" : ""}
    </span>
    
    <span className="block text-xs">{user.name}</span>
    <span className="balance">Balance disponible : {user.balance}</span>  
  </span>
  
)}
        <FaAngleDown />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">

          <li>
            <Link
              href="/settings"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <FaWhmcs />
              Ajustes de la Cuenta
            </Link>
          </li>
        </ul>

        <form action="/signin" method="post">
          <input
            type="hidden"
            name="csrfToken"
            value="0f127119f5c5943bf3d6645bc50e78ce7962cc6491b5d060e70486206930405d"
          ></input>
          <button 
          onClick={handleSignOut}

          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          type="button"
        >
          <FaArrowRightFromBracket />
          Cerrar Sesión
        </button>
        </form>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;