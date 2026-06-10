import { HttpGet, HttpPost } from "./Http"

export const getEstadoPlanLectra = async (lectra) => {
    try {
        const data = await HttpGet(`lectra/plan/${lectra}`)
        return data
    } catch (error) {
        return error
    }
}

export const getEstadoLectras = async () => {
    try {
        const data = await HttpGet('lectras/estado')
        return data
    } catch (error) {
        return error
    }
}


export const getEstadoLectrasTimeline = async (payload = null) => {
    try {
        let url = 'lectras/estado4'
        if (payload && typeof payload === 'object') {
            const params = new URLSearchParams()
            Object.entries(payload).forEach(([key, value]) => {
                if (value === undefined || value === null || `${value}`.trim() === '') {
                    return
                }
                params.append(key, value)
            })

            const qs = params.toString()
            if (qs) {
                url = `${url}?${qs}`
            }
        }

        const data = await HttpGet(url)
        return data
    } catch (error) {
        console.log(error)
        return { message: error, error: true }
    }
}


export const getStockCorteBuffer = async () => {
    try {
        const data = await HttpGet('lectras/stock_corte')
        return data
    } catch (error) {
        console.log(error)
        return { message: error, error: true }
    }
}


export const getPendientesCorte = async () => {
    try {
        const data = await HttpGet('corte/pendientes')
        return data
    } catch (error) {
        return error
    }
}

export const getPendientePlanificacion = async () => {
    try {
        const data = await HttpGet('corte/pendientes_planificacion')
        return data
    } catch (error) {
        return error
    }
}

export const setPlanCorte = async (payload) => {
    try {
        const data = await HttpPost('corte/plan', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const setInicioDado = async (payload) => {
    try {
        const data = await HttpPost('corte/inicio_dado', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const setEndDado = async (payload) => {
    try {
        const data = await HttpPost('corte/fin_dado', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getPlanificaciones = async () => {
    try {
        const data = await HttpGet('corte/planificaciones')
        return data
    } catch (error) {
        return error
    }
}

export const getPlanificacion = async (operacion) => {
    try {
        const data = await HttpPost(`corte/planificacion`, JSON.stringify(operacion))
        // const data = await HttpGet(`corte/planificacion/${operacion}`)
        return data
    } catch (error) {
        return error
    }
}

export const getPCPendientePlanificacion = async () => {
    try {
        const data = await HttpGet('pc/pendientes_planificacion')
        return data
    } catch (error) {
        return error
    }
}

export const getDatosAbastecimiento = async () => {
    try {
        const data = await HttpGet('pc/abastecimiento')
        return data
    } catch (error) {
        return error
    }
}

export const setAbastecido = async (id, modelo = false) => {
    try {
        const data = await HttpGet(`pc/abastecer/${id}/${modelo ? 1 : 0}`)
        return data
    } catch (error) {
        return error
    }
}

export const intercambiaPlanAnterior = async (payload) => {
    try {
        const data = await HttpPost('corte/plan/intercambia', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const existePlanCorte = async (payload) => {
    try {
        const data = await HttpPost('corte/plan/existe', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const quitarModeloPlanificacionPendiente = async (payload) => {
    try {
        const data = await HttpPost('corte/quitar_modelo', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}


export const actualizaEstadoDadoCorte = async (payload) => {
    try {
        const data = await HttpPost('corte/actualiza_estado_dado', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getEstadoFrenoLectra = async (payload) => {
    try {
        const data = await HttpPost('lectra/estado/frenada', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const setInicioLectra = async (payload) => {
    try {
        const data = await HttpPost('lectra/inicio', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getHoraInicioLectra = async (payload) => {
    try {
        const data = await HttpPost('lectra/estado/inicio', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const actualizaCorteModelo = async (payload) => {
    try {
        const data = await HttpPost('corte/actualiza_corte_ejecutado', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const actualizaCorteTiempos = async (payload) => {
    try {
        const data = await HttpPost('corte/actualiza/tiempos', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}
