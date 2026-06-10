import { useEffect, useState } from "react"
import useUsers from "./useUsers"
import useLineaOperaciones from "./useLineaOperaciones"
import { removeDataTablero } from "../services/LineaOperacionesService"

export const useDragAndDrop = (turno) => {
    const { getUser } = useUsers()
    const { saveDataTablero } = useLineaOperaciones()
    const { getUserLibres, isLoading: isLoadingUsers } = useLineaOperaciones(false)

    const [usersDisponible, setUsersDisponible] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    const [listItems, setListItems] = useState([])

    const fetchUsuarios = async () => {
        const data = await getUserLibres()
        setUsersDisponible(data?.data)
    }

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const handleUpdateList = async (idOrigen, idDestino) => {

        const tmp = listItems

        let i = idDestino.indexOf("-")
        const ordenDestino = parseInt(idDestino.substring(0, i))
        const lineaDestino = idDestino.substring(i + 1)

        i = idOrigen.indexOf("-")
        const ordenOrigen = parseInt(idOrigen.substring(0, i).trim())
        const lineaOrigen = idOrigen.substring(i + 1).trim()

        let cardOrigen;
        let cardDestino = tmp.filter(l => l.linea == lineaDestino)[0]?.operaciones?.find(item => item.orden == ordenDestino)

        if (lineaOrigen == 0) {
            const data = await getUser(ordenOrigen, true)
            cardOrigen = {
                operario: {
                    user: data?.data
                }
            }

        } else {
            cardOrigen = tmp.filter(l => l.linea == lineaOrigen)[0]?.operaciones?.find(item => item.orden == ordenOrigen)
            // cardOrigen.operario
        }
        cardOrigen.operario.user.turno = turno
        // cardDestino.operario.user.turno = turno

        const items = tmp
        const tmpCardNew = cardOrigen?.operario
        const tmpDestino = cardDestino?.operario

        // console.log(tmpCardNew)
        // console.log(tmpDestino)

        // tmpCardNew.user.turno = turno

        if (lineaOrigen == lineaDestino) {
            items.forEach(i => {
                if (i.linea == lineaOrigen) {
                    i.operaciones.forEach(o => {
                        if (o.orden == ordenDestino) {
                            o.operario = tmpCardNew
                            o.operario.user.turno = turno
                        }

                        if (o.orden == ordenOrigen) {
                            // console.log(tmpDestino)
                            o.operario = tmpDestino
                            // console.log(o)
                            o.operario.user.turno = turno
                        }
                    })
                }
            });
        } else {
            items.forEach(i => {
                if (i.linea == lineaDestino) {
                    i.operaciones.forEach(o => {
                        if (o.orden == ordenDestino) {
                            o.operario = tmpCardNew
                            o.operario.user.turno = turno
                        }
                    })
                }

                if (i.linea == lineaOrigen && lineaOrigen != 0) {
                    i.operaciones.forEach(o => {
                        if (o.orden == ordenOrigen) {
                            o.operario = tmpDestino
                            o.operario.user.turno = turno
                        }
                    })
                }
            });
        }

        items.forEach(i => {
            i.operaciones.forEach(o => {
                if (o.operario) {
                    o.operario.user.turno = turno
                }
            })
        })

        // items.forEach(i => i.operaciones.forEach(o => o?.operario?.user?.turno = turno))

        if (Array.isArray(items)) {
            // console.log(items)
            await saveDataTablero(items)
            if (lineaOrigen == 0) {
                fetchUsuarios()
            }
            setListItems(items)
        }

    }

    const handleDragging = (dragging) => setIsDragging(dragging)

    const handleSetDisponible = async (item) => {

        const items = listItems
        items.forEach(i => {
            if (i.linea == item?.linea) {
                i.operaciones.forEach(o => {
                    if (o.orden == item?.orden) {
                        o.operario = null
                    }
                })
            }

            i.operaciones.forEach(o => {
                if (o.operario) {
                    o.operario.user.turno = turno
                }
            })
        });

        // console.log(item)
        await removeDataTablero(item?.operario?.user_id ? item?.operario?.user_id : item?.operario?.user?.id)
        await saveDataTablero(items)
        fetchUsuarios()
        setListItems((prev) => [...items])
    }

    const setEstadoInicial = (estado) => {
        if (typeof estado === "function") {
            setListItems(prev => estado(prev))
            return
        }

        setListItems(estado)
    }

    return {
        isDragging,
        listItems,
        usersDisponible,
        isLoadingUsers,
        setEstadoInicial,
        handleUpdateList,
        handleDragging,
        handleSetDisponible,
        fetchUsuarios
    }
}
