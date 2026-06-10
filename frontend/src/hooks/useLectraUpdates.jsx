import { getEstadoLectras, getEstadoLectrasTimeline, getEstadoPlanLectra, setEndDado, setInicioDado } from '@services/LectraService';
import { useEffect, useState } from 'react';


const useLectraUpdates = (autoLoad = true, timeline = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])

    const getPlanLectra = async (lectra, withReturn = false) => {
        setIsLoading(true)

        try {
            const data = await getEstadoPlanLectra(lectra)

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)

        }
    }

    const getData = async (withReturn = false) => {
        // if (!userData.id) return
        // console.log("PASO")
        setError(null)
        setIsLoading(true)

        try {
            let data;

            if (!timeline) {
                data = await getEstadoLectras()
            } else {
                data = await getEstadoLectrasTimeline()
            }
            // console.log(data)
            if (withReturn) {
                setIsLoading(false)
                return data
            }

            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const endDadoById = async (dadoId, lectra, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await setEndDado({ dado: null, dadoId: dadoId, lectra: lectra })

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            // console.log(data.data)
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const endDado = async (dado, lectra, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await setEndDado({ dado: dado, dadoId: null, lectra: lectra })

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            // console.log(data.data)
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const initDado = async (dado, lectra, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await setInicioDado({ dado: dado, dadoId: null, lectra: lectra })

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            // console.log(data.data)
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const initDadoById = async (dadoId, lectra, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await setInicioDado({ dado: null, dadoId: dadoId, lectra: lectra })

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            // console.log(data.data)
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    return { response, isLoading, error, getData, initDado, initDadoById, endDado, endDadoById, getPlanLectra }
}


export default useLectraUpdates