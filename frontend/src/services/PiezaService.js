import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete, HttpPostFile } from "./Http"

export const getPiezas = async () => {
    try {
        const data = await HttpGet('piezas')
        return data
    } catch (error) {
        return error
    }
}

export const getPiezaById = async (id) => {
    try {
        const data = await HttpGet(`piezas/${id}`)
        return data
    } catch (error) {
        return error
    }
}

export const getPiezasByKanbanCode = async (kanbanCode, esEgreso = true) => {
    try {
        const data = await HttpGet(`kanban/${kanbanCode}/piezas/${esEgreso ? 1 : 0}`)
        return data
    } catch (error) {
        return error
    }
}

export const updatePiezaById = async (id, payload) => {
    try {
        const data = payload instanceof FormData
            ? await HttpPostFile(`piezas/${id}`, payload)
            : await HttpPut(`piezas/${id}`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getFileKanbansReposicion = async () => {
    try {
        const data = await HttpGet("test")
        return data
    } catch (error) {
        return error
    }
}

export const getMaterialesPiezas = async () => {
    try {
        const data = await HttpGet("materiales_piezas")
        return data
    } catch (error) {
        return error
    }
}


