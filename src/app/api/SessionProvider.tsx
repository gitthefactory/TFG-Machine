"use client"
import { SessionProvider } from "next-auth/react";

// Definir el tipo para las propiedades
export default function RootLayout({ children }) {
  return (
   <>
    <SessionProvider>{children}</SessionProvider>

   </>
  );
}






























/* El error que estás viendo, Error: [next-auth]: useSession must be wrapped in a <SessionProvider />, indica que necesitas envolver tu aplicación con el SessionProvider de NextAuth para que useSession funcione correctamente. Esto suele hacerse en tu archivo _app.tsx o layout.tsx, dependiendo de cómo esté estructurada tu aplicación Next.js.

Aquí te muestro cómo puedes hacerlo:

Envolver tu aplicación con SessionProvider:

Si estás utilizando un archivo _app.tsx, debería verse algo así:

tsx
Copiar código
// pages/_app.tsx
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
Si estás utilizando layout.tsx, podrías hacerlo así:

tsx
Copiar código
// app/layout.tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        
      </body>
    </html>
  );
}
Redireccionar si hay un token existente en /maquinas:

Para redirigir a los usuarios en el componente Maquinas, puedes usar useSession de NextAuth para verificar si hay una sesión activa y redirigir en consecuencia. Aquí tienes un ejemplo de cómo hacerlo:

tsx
Copiar código
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Maquinas: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Redirigir a la URL deseada si hay un token existente
      router.replace(`/games/?idMachine=${info.id_machine}`);
    }
  }, [session, router]);

  // ...el resto de tu componente
};

// app/layout.tsx



import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    // Proveer la sesión a todos los componentes
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp; */