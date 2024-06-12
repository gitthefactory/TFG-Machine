

export default async function getSingleClient(id: any){
    try {
        const response = await fetch(`http://localhost:3000/api/clientes/${id}`,{
            cache: "no-store",
        });
        const cliente = await response.json();
        return cliente.data;
    } catch (error) {
        console.log(error)
    }
}
