

export default async function getSingleMachine(id: any){
    try {
        const response = await fetch(`http://localhost:3000/api/maquinas/${id}`,{
            
            cache: "no-store",
        });
        const maquina = await response.json();
        return maquina.data;
    } catch (error) {
        console.log(error)
    }
}
