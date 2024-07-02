

export default async function getSingleClient(id: any){
    try {
        const response = await fetch(`/api/clientes/${id}`,{
            cache: "no-store",
        });
        const cliente = await response.json();
        return cliente.data;
    } catch (error) {
        console.log(error)
    }
}
