import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const getDoorTrim = async () => {
    try {
        const data = await HttpGet('door_trim')
        return data
    } catch (error) {
        return error
    }
}

export const getModelos = async () => {
    try {
        const data = await HttpGet('modelos')
        return data
    } catch (error) {
        return error
    }
}

export const getModelosWms = async () => {
    try {
        const data = await HttpGet('wms_modelos')
        return data
    } catch (error) {
        return error
    }
}

export const getModelo = async (id) => {
    try {
        const data = await HttpGet(`modelos/${id}`)
        return data
    } catch (error) {
        return error
    }
}

export const getPartesByModelo = async (modeloId) => {
    try {
        const data = await HttpGet(`modelos/${modeloId}/partes`)
        return data
    } catch (error) {
        return error
    }
}

export const getPartesByModeloWms = async (modeloId) => {
    try {
        const data = await HttpGet(`wms_modelos/${modeloId}/partes`)
        return data
    } catch (error) {
        return error
    }
}

export const getPiezasByParte = async (parteId) => {
    try {
        const data = await HttpGet(`partes/${parteId}/piezas`)
        return data
    } catch (error) {
        return error
    }
}

export const updateModel = async (id, payload) => {
    try {
        const data = await HttpPut(`modelos/${id}`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const updateModeloDatos = async (payload) => {
    try {
        const data = await HttpPut(`modelos`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const updateModelLines = async (id, payload) => {
    try {
        const data = await HttpPut(`modelos/${id}/lineas`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getArchivos = async (id) => {
    try {
        const data = await HttpGet(`modelos/${id}/archivos`)
        return data
    } catch (error) {
        return error
    }
}

export const getArchivosFallas = async (id) => {
    try {
        const data = await HttpGet(`modelos/${id}/fallas/imagenes`)
        return data
    } catch (error) {
        return error
    }
}

export const deleteImagenFalla = async (id) => {
    try {
        const data = await HttpDelete(`modelo/fallas/imagenes/${id}`)
        return data
    } catch (error) {
        return error
    }
}

export const setArchivosFallas = async (payload) => {
    try {
        const data = await HttpPost(`modelos/fallas/imagenes`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getKanbanPapa = async (kanban, lectra) => {
    try {
        const data = await HttpGet(`modelo/kanban_papa/${kanban}/${lectra}`)
        return data
    } catch (error) {
        return error
    }
}


export const getKanbanPapaByModel = async (model) => {
    try {
        const data = await HttpGet(`modelo/${model}/kanban_papa`)
        return data
    } catch (error) {
        return error
    }
}


export const getDadoById = async (id) => {
    try {
        const data = await HttpGet(`kanban_papa/dado/${id}`)
        return data
    } catch (error) {
        return error
    }
}

export const saveDado = async (payload) => {
    try {
        const data = await HttpPost('kanban_papa/dado', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const deleteDadoById = async (id) => {
    try {
        const data = await HttpDelete(`kanban_papa/dado/${id}`)
        return data
    } catch (error) {
        return error
    }
}


export const getModelosLinea = async (linea) => {
    try {
        const data = await HttpGet(`linea/${linea}/modelos`)
        return data
    } catch (error) {
        return error
    }
}
