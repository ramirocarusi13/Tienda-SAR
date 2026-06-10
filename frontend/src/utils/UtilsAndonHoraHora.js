// Convierte "HH:MM" a un Date del día de 'baseDate' (local)
function timeToDate(baseDate, hhmm) {
    const [h, m] = hhmm.trim().split(":").map(Number);
    const d = new Date(baseDate);
    if (h == 0) {
        d.setDate(d.getDate() + 1)
    }
    d.setHours(h, m, 0, 0);
    return d;
}

// Devuelve true si 'when' ∈ [start, end)
// Soporta intervalos que cruzan medianoche (ej: 23:00 - 02:00)
function isInInterval(when, startStr, endStr) {
    const start = timeToDate(when, startStr);
    let end = timeToDate(when, endStr);

    // console.log(start, end)

    // Si el fin es "menor" que el inicio, cruza medianoche -> sumar 1 día a 'end'
    if (end <= start) {
        end.setDate(end.getDate() + 1);
    }

    // Si 'when' es antes del inicio pero el intervalo cruza medianoche,
    // puede que 'when' pertenezca al tramo del día siguiente; ajustar 'when' +1 día para comparar
    let w = new Date(when);
    if (end.getDate() !== start.getDate() && w < start) {
        w.setDate(w.getDate() + 1);
    }

    return w >= start && w < end; // cierre izquierdo, abierto derecho (evita solapes en el minuto exacto)
}

// Encuentra el índice del intervalo que contiene 'when' (o -1 si ninguno)
export function findIntervalIndex(intervalo, when = new Date()) {
    // return intervals.findIndex(({ intervalo }) => {
    const [ini, fin] = intervalo?.intervalo.split("-").map(s => s.trim());
    return isInInterval(when, ini, fin);
    // });
}

export function aunNoPasoIntervalo(intervalo, when = new Date()) {
    const [startStr, endStr] = intervalo?.intervalo.split("-").map(s => s.trim());

    const start = timeToDate(when, startStr);
    let end = timeToDate(when, endStr);

    // Si el fin es "menor" que el inicio, cruza medianoche -> sumar 1 día a 'end'
    if (end <= start) {
        end.setDate(end.getDate() + 1);
    }

    // Si 'when' es antes del inicio pero el intervalo cruza medianoche,
    // puede que 'when' pertenezca al tramo del día siguiente; ajustar 'when' +1 día para comparar
    let w = new Date(when);
    if (end.getDate() !== start.getDate() && w < start) {
        w.setDate(w.getDate() + 1);
    }

    // console.log(w, start, w <= start)

    return w <= start;
}