import { getSession } from "next-auth/react";

const ITEMS_PER_PAGE = 6;

export default async function getOperators(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Get the current user's session
    const session = await getSession();

    // Fetch operator data
    const response = await fetch(`/api/usuarios?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
      cache: "no-store",
    });

    const operators = await response.json();
    // console.log('Operators Data:', operators.data); // Añade esta línea para verificar los datos
    // Return the operator data
    return operators.data;
  } catch (error) {
    console.error("Error fetching operators:", error);
    return [];
  }
}
