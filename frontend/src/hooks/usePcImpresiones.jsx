import { useEffect, useState } from 'react';
import { getPendientes, quitPendingKanbans, setPlanificacion, getSituacionActual } from '@services/PcService';

const usePcImpresiones = (autoLoad = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            fetchPendientes();
        }
    }, [])

    const fetchSituacionActual = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getSituacionActual()

            if (withReturn) {
                setIsLoading(false)
                return data
            }
            setResponse(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }


    const fetchPendientes = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPendientes()

            if (withReturn) {
                setIsLoading(false)
                return data
            }
            setResponse(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const armarPlanificacion = async (payload) => {
        setError(null)
        setIsLoading(true)

        try {
            // const payload = {
            //     multiple,
            //     kanbans: codigosKanban
            // }

            const data = await setPlanificacion({ items: payload })
            // setResponse(data)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const setNotPendiente = async (codigosKanban, multiple = false) => {
        setError(null)
        setIsLoading(true)

        try {
            const payload = {
                multiple,
                kanbans: codigosKanban
            }

            const data = await quitPendingKanbans(payload)
            // setResponse(data)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }


    return { response, isLoading, error, fetchSituacionActual, armarPlanificacion, fetchPendientes, setNotPendiente }
}


export default usePcImpresiones