

export default async function getSingleRoom(id: any){
    try {
        const response = await fetch(`http://localhost:3000/api/salas/${id}`,{
            cache: "no-store",
        });
        const sala = await response.json();
        return sala.data;
    } catch (error) {
        console.log(error)
    }
}
