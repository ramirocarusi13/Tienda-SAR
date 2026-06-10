import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const getAndonLineas = async () => {
    try {
        const data = await HttpGet(`andon/lineas`)
        return data
    } catch (error) {
        return error
    }
}

export const getAndonDefectoLineaHoraHora = async (linea) => {
    try {
        const data = await HttpGet(`andon/defectos/linea/${linea}`)
        return data
    } catch (error) {
        return error
    }
}
