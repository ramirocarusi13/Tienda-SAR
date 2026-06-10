import { HttpPost } from "./Http"

export const getTrazabilidadAirbag = async (codigo) => {
    try {
        const data = await HttpPost('trazabilidad_airbag', JSON.stringify({
            codigo: codigo
        }))
        return data
    } catch (error) {
        return error
    }
}
