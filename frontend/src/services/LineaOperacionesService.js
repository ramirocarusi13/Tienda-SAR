import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"


export const getOperaciones = async (turno) => {
    try {
        const data = await HttpGet(`linea/operaciones?turno=${turno}`)
        return data
    } catch (error) {
        return error
    }
}

export const getOperacion = async (id) => {
    try {
        const data = await HttpGet(`linea/operaciones/${id}`)
        return data
    } catch (error) {
        return error
    }
}

export const updateOperacion = async (id, payload) => {
    try {
        const data = await HttpPut(`linea/operaciones/${id}`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const saveOperacion = async (payload) => {
    try {
        const data = await HttpPost(`linea/operaciones`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getUsersSinOperacion = async () => {
    try {
        const data = await HttpGet(`user/sin_operacion`)
        return data
    } catch (error) {
        return error
    }
}

export const removeDataTablero = async (userId) => {
    try {
        const data = await HttpDelete(`linea/tablero/${userId}`)
        return data
    } catch (error) {
        return error
    }
}

export const updateTablero = async (payload) => {
    const items = { items: payload }
    try {
        const data = await HttpPost(`linea/tablero`, JSON.stringify(items))
        return data
    } catch (error) {
        return error
    }
}

export const reasignarOperariosLinea = async (payload) => {

    try {
        const data = await HttpPost(`linea/reasignar`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const actualizarLinea = async (payload) => {
    try {
        const data = await HttpPost(`linea/actualizar`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}
