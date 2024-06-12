import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getServerSession } from "next-auth/next";
import React from "react";
import { handler } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

async function Perfil() {
  const session = await getServerSession(handler);
  console.log(session);

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Perfil" />
        <div className="mx-auto max-w-242.5">
          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-35 md:h-65"></div>
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="">
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {session.user.name}
                </h3>
                <p className="font-medium">ROL: {session.user.name}</p>
                <Link href={"/api/auth/signout"}>cerrar sesion</Link>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}

export default Perfil;
