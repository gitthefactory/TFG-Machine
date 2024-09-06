"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; 
import { useEffect } from "react";
const SignIn: React.FC = () => {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  function handleInput(e: any) {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('callbackUrl')) {
        url.searchParams.delete('callbackUrl');
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, []);
  async function handleSubmit(e: any) {
    e.preventDefault();  
    if (!info.email || !info.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setPending(true);
      const res = await signIn("credentials", {
        
        email: info.email,
        password: info.password,
        redirect: false,  
        
      });
  
      if (res?.error) {
        setError("Correo o contraseña incorrectos");
      } else {
        router.replace("/");
        
      }
    } catch (error) {
      setError("Ocurrió un error al iniciar sesión");
    } finally {
      router.refresh();
      setPending(false);
    }
  }
  

  return (
    <>
    <style jsx>{`
      /* Estilos CSS */ 
      .rounded-sm {
        background-image: url("/images/logo/fondo.png");
        color: white;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        border: none;
      }

      .relative {
        // max-width: 300px;
        // background: white;
        // border-radius: 90px;
      }

      input[type='submit'] {
        width: 90%;
        border: none;
        background-color: rgb(227, 17, 108);
        max-width: 250px;
      }    

    `}</style>
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center" >
            <div className="px-26 py-17.5 text-center">
              <Link className="inline-block" href="/">
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-white.png"}
                  alt="Logo"
                  width={350}
                  height={350}
                />
              </Link>
          <div className="w-full border-stroke dark:border-strokedark">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <form onSubmit={handleSubmit}>
              <div className="mb-4">
                  <label className="mb-2.5 block font-medium">
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => handleInput(e)}
                      name="email"
                      type="email"
                      placeholder="Correo Electrónico"
                      className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium">
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => handleInput(e)}
                      name="password"
                      type="password"
                      placeholder="Contraseña"
                      className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                  </div>
                </div>
                {error && <span className="message">{error}</span>}
                <div className="mb-5">
                  <input
                    type="submit"
                    value="Iniciar Sesión"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
