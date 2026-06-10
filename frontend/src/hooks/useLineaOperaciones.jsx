import { getOperaciones, getOperacion, reasignarOperariosLinea, updateOperacion, getUsersSinOperacion, updateTablero } from '@services/LineaOperacionesService';
import { useEffect, useState } from 'react';
import { saveOperacion } from '../services/LineaOperacionesService';

const useLineaOperaciones = (autoLoad = false, insertaVacias = false, turno = null) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [turno])


    const getData = async () => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getOperaciones(turno)

            const topeOperaciones = 12
            const res = []
            // const opsOtras = []

            if (insertaVacias) {

                data?.data?.forEach(element => {
                    const operacionesLinea = element.operaciones
                    let ops = []

                    for (let index = 1; index <= topeOperaciones; index++) {

                        const existente = operacionesLinea.find(d => d.orden == index)

                        if (existente) {
                            ops.push(existente)
                        } else {
                            ops.push({ nombre: "Vacia", vacia: true, orden: index })
                        }
                    }


                    // ops.sort((a, b) => a.orden - b.orden)
                    res.push({
                        ...element,
                        operaciones: ops,
                    })
                });

                // console.log(res)
                setResponse(res)
                // setResponse(data?.data)
            } else {
                setResponse(data.data)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const getItem = async (id, withReturn = false) => {
        setError(null)
        setIsLoading(true)
        try {
            const data = await getOperacion(id)
            setIsLoading(false)
            if (withReturn) {
                return data
            }
            setResponse(data)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)
        }
    }

    const saveItem = async (id, payload, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        // console.log(payload)
        try {
            let data;
            if (id) {
                data = await updateOperacion(id, payload)
            } else {
                data = await saveOperacion(payload)
            }
            setIsLoading(false)
            // if (withReturn) {
            return data
            // }
            // setResponse(data)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)
        }
    }

    const getUserLibres = async () => {
        setError(null)
        setIsLoading(true)
        // console.log("ENTRO")
        try {

            const data = await getUsersSinOperacion()
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const saveDataTablero = async (payload) => {


        // const payload = {
        //     items: items,
        //     remove: itemRemove
        // }

        setError(null)
        setIsLoading(true)
        try {
            // console.log(payload)
            const data = await updateTablero(payload)
            setIsLoading(false)
            // if (withReturn) {
            return data
            // }
            // setResponse(data)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)
        }
    }

    const reasignarOperarios = async (linea, disponibles = false) => {
        setError(null)
        setIsLoading(true)

        const payload = {
            linea,
            disponibles
        }

        try {
            const data = await reasignarOperariosLinea(payload)
            setResponse(data?.data)
            getUserLibres()
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)
        }
    }

    return { response, isLoading, error, getData, getItem, reasignarOperarios, saveItem, getUserLibres, saveDataTablero }
}


export default useLineaOperaciones
