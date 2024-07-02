

export default async function getSingleUser(id: any){
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${id}`,{
            cache: "no-store",
        });
        const users = await response.json();
        return users.data;
    } catch (error) {
        console.log(error)
    }
}
