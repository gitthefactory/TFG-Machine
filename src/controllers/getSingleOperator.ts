

export default async function getSingleOperator(id: any){
    try {
        const response = await fetch(`/api/operadores/${id}`,{
            cache: "no-store",
        });
        const operador = await response.json();
        return operador.data;
    } catch (error) {
        console.log(error)
    }
}
