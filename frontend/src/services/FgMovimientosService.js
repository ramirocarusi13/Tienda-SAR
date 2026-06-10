import { HttpPost } from "./Http"

export const fetchMovimientosFg = async (payload) => {
    try {
        const data = await HttpPost('fg_movimientos', JSON.stringify(payload), false)
        return data
    } catch (error) {
        return error
    }
}
