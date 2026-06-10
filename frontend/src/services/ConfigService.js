import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const vaciaBufferLinea = async (linea) => {
    try {
        const data = await HttpGet(`config/vaciar_buffer/${linea}`)
        return data
    } catch (error) {
        return error
    }
}


export const getContenidoBuffer = async (linea) => {
    try {
        const data = await HttpGet(`config/getBuffer/${linea}`)
        return data
    } catch (error) {
        return error
    }
}


export const quitarDeBuffer = async (kanban) => {
    try {
        const data = await HttpGet(`config/quitar_buffer/${kanban}`)
        return data
    } catch (error) {
        return error
    }
}
