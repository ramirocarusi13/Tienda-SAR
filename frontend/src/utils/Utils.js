import dayjs from "dayjs"
import { jerarquias } from "./Constants"

export const getFullMonth = (date) => {
    let month = date.getMonth() + 1 + ""
    if (month.length < 2) {
        month = `0${month}`
    }

    return month
}

export const getFullDay = (date, rest = false) => {
    let day;

    if (rest) {
        date.setDate(date.getDate())
        day = date.getDate() + ""
    } else {
        date.setDate(date.getDate() + 1)
        day = date.getDate() + ""
    }

    if (day.length < 2) {
        day = `0${day}`
    }

    return day
}

export const minutesToTime = (minutes) => {
    let h = 0, m = 0;
    let tmp = 0;

    if (minutes >= 60) {
        tmp = minutes / 60;
        h = parseInt(tmp)
        m = tmp - parseInt(tmp)


        if (m < 1) {
            m = parseInt(m * 60)
        }
        // console.log(m)

    } else {
        h = "00"
        m = minutes
    }

    return `${getFormatLengthZero(h, 2)}:${getFormatLengthZero(m, 2)}`



}

export const getFormatLengthZero = (text, length) => {
    let res;
    let zeros = ""

    res = text + ""
    if (res.length < length) {

        for (let i = 0; i < (length - res.length); i++) {
            zeros += "0"
        }

        res = `${zeros}${res}`
    }

    return res
}

export const formatDateEn = (date) => {
    // const date = new Date(dateString)
    return `${date.getFullYear()}-${getFullMonth(date)}-${getFullDay(date, true)}`
}

export const formatDate = (dateString, rest = true) => {
    const date = new Date(dateString)
    return `${getFullDay(date, rest)}/${getFullMonth(date)}/${date.getFullYear()}`
}

export const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return `${getFullDay(date, true)}/${getFullMonth(date)}/${date.getFullYear()} ${getFormatLengthZero(date.getHours(), 2)}:${getFormatLengthZero(date.getMinutes(), 2)}`
}

export const formatTime = (timeString) => {
    if (!timeString || timeString == '' || timeString == null) {
        return ''
    }
    const date = new Date(timeString)
    return `${getFormatLengthZero(date.getHours(), 2)}:${getFormatLengthZero(date.getMinutes(), 2)}`
}


export const difBetweenDate = (dateInit = null, dateEnd = null, withSeconds = false) => {

    let cTime;

    if (dateEnd) {
        cTime = dayjs(dateEnd)
    } else {
        cTime = dayjs() // ahora
    }

    // const cTime = dayjs()
    const lTime = dayjs(dateInit)

    let h = cTime.diff(lTime, 'hour')
    let m = cTime.diff(lTime, 'minute')
    let s = cTime.diff(lTime, 'seconds')

    if (m > 60) {
        m = m / 60
        m = (m - h) * 60
    }

    s = s / 60 / 60
    s = s - h //Le resto las horas actuales
    s = s * 60 //Lo paso a minutos
    s = (s - m)
    s = parseInt(s * 60) // Lo paso a segundos

    m = m.toFixed()
    h = h.toFixed()
    s = s.toFixed()

    if (h.length < 2) {
        h = `0${h}`
    }

    if (m.length < 2) {
        m = `0${m}`
    }

    if (s.length < 2) {
        s = `0${s}`
    }

    if (withSeconds) {
        return `${h}:${m}:${s}`
    } else {
        return `${h}:${m}`
    }
}

export function diferenciaTiempo(fechaParametro) {
    const ahora = new Date();
    const fecha = new Date(fechaParametro);

    // Diferencia en milisegundos
    let diffMs = fecha - ahora;

    // Si la fecha ya pasó, tomar valor absoluto
    diffMs = Math.abs(diffMs);

    const minutos = Math.floor(diffMs / (1000 * 60));
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
        return `${minutos} minutos`;
    } else if (horas < 24) {
        return `${horas} horas`;
    } else {
        return `${dias} días`;
    }
}

const CRITICAL_LEVEL = '50'
const LEVEL_A = '40'
const LEVEL_B = '30'
const LEVEL_C = '20'
const LEVEL_D = '10'

export const estadosParateLectra = [
    'MANTENIMIENTO',
    'FALLA SISTEMA',
    'FALTA DE TENDIDO',
    'DEMORA PICKEO'
]

export const obtenerJerarquiaPorValor = (valor) => {

    // console.log(valor)
    if (valor == '') {
        return ''
    }

    try {
        return Object.keys(jerarquias).find(clave => jerarquias[clave] === valor);
    } catch (error) {
        return ""
    }
}


export const getColorLevelOperationLine = (level) => {
    if (level == LEVEL_A) {
        return 'bg-[#c65911]'
    } else if (level == LEVEL_B) {
        return 'bg-[#ffff00]'
    } else if (level == LEVEL_C) {
        return 'bg-[#00b0f0]'
    } else if (level == LEVEL_D) {
        return 'bg-[#00b050]'
    } else if (level == CRITICAL_LEVEL) {
        return 'bg-[#ff0000]'
    } else {
        return 'bg-slate-300'
    }
}

export const getNivelName = (level) => {
    if (level == LEVEL_A) {
        return 'A'
    } else if (level == LEVEL_B) {
        return 'B'
    } else if (level == LEVEL_C) {
        return 'C'
    } else if (level == LEVEL_D) {
        return 'D'
    } else if (level == CRITICAL_LEVEL) {
        return 'S'
    } else {
        return ''
    }
}

export const getLineName = (linea) => {
    if (linea == "S3") {
        return "ISOFIX"
    } else if (linea == "S10") {
        return "FLEX"
    } else if (linea == "M13") {
        return "NEW PROJECTS"
    } else {
        return linea
    }
}