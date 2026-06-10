import { HttpGet, HttpPost } from "./Http"


export const fetchKanbansDia = async () => {
    try {
        const data = await HttpGet('pc/kanbans_del_dia')
        return data
    } catch (error) {
        return error
    }
}

export const filterKanbansDia = async (payload) => {
    try {
        const data = await HttpPost('pc/kanbans_del_dia', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getPendientes = async () => {
    try {
        const data = await HttpGet('pc/pendientes_impresion')
        return data
    } catch (error) {
        return error
    }
}

export const setPlanificacion = async (payload) => {
    try {
        const data = await HttpPost('pc/planificar', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const quitPendingKanbans = async (payload) => {
    try {
        const data = await HttpPost('pc/quitar_pendientes', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const savePlan = async (payload) => {
    try {
        const data = await HttpPost('pc/guardar_plan', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getPlanActual = async () => {
    try {
        const data = await HttpGet('pc/plan_actual')
        return data
    } catch (error) {
        return error
    }
}

export const getStockModelos = async () => {
    try {
        const data = await HttpGet('pc/stock_modelos')
        return data
    } catch (error) {
        return error
    }
}

export const getSituacionActual = async () => {
    try {
        const data = await HttpGet('pc/situacion_modelos')
        return data
    } catch (error) {
        return error
    }
}

export const getPlanSemanal = async () => {
    try {
        const data = await HttpGet('pc/plan_semanal')
        return data
    } catch (error) {
        return error
    }
}

export const getStockPlanSemanal = async () => {
    try {
        const data = await HttpGet('pc/plan_semanal/stock')
        return data
    } catch (error) {
        return error
    }
}



export const postPlanSemanal = async (plan) => {
    try {
        // const data = await HttpPost('pc/guardar_plan', JSON.stringify(payload))
        const data = await HttpPost('pc/plan_semanal', JSON.stringify({ items: plan }))
        // console.log(data)
        return data
    } catch (error) {
        return error
    }
}

export const ejecutarPlanAutomatico = async () => {
    try {
        const data = await HttpGet('pc/ejecutar_plan')
        return data
    } catch (error) {
        return error
    }
}

export const actualizaOrdenPlanYEjecutar = async (items) => {

    try {
        const data = await HttpPost('pc/ejecutar_plan', JSON.stringify({ items: items }))
        return data
    } catch (error) {
        return error
    }
}

export const getKanbansPlanificados = async () => {
    try {
        const data = await HttpGet('pc/kanbans_pendientes')
        return data
    } catch (error) {
        return error
    }
}
