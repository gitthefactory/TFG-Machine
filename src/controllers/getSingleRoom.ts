

export default async function getSingleRoom(id: any){
    try {
        const response = await fetch(`/api/salas/${id}`,{
            cache: "no-store",
        });
        const sala = await response.json();
        return sala.data;
    } catch (error) {
        console.log(error)
    }
}
