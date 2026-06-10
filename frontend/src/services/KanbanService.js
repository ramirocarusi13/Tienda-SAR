import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const createKanban = async (payload) => {
    try {
        const data = await HttpPost('kanban', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const createKanbanSar = async (payload) => {
    try {
        const data = await HttpPost('kanbanSar', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getKanbans = async () => {
    try {
        const data = await HttpGet('kanban')
        return data
    } catch (error) {
        return error
    }
}

export const getKanbansFilters = async (payload) => {
    try {
        const data = await HttpPost('kanban/filter', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const changeStatusKanban = async (payload) => {
    try {
        const data = await HttpPut('kanban', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getKanban = async (kanbanCode) => {
    try {
        const data = await HttpGet(`kanban/${kanbanCode}/existencia`)
        return data
    } catch (error) {
        return error
    }
}

export const verificaExistenciaKanbanEstado = async (payload) => {
    try {
        const data = await HttpPost('kanban/existencia/estado', JSON.stringify(payload), false)
        return data
    } catch (error) {
        return error
    }
}


export const getHistory = async (kanbanCode) => {
    try {
        const data = await HttpGet(`test2/${kanbanCode}`)
        return data
    } catch (error) {
        return error
    }
}

export const corrijeBuffer = async (payload) => {
    try {
        const data = await HttpPost(`buffer/corrigekanban`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}


export const getKanbanReport = async (kanbanCode) => {
    try {
        const data = await HttpGet(`kanban/reporte/${kanbanCode}`)
        return data
    } catch (error) {
        return error
    }
}
