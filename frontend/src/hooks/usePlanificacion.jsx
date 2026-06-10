import { getPendientePlanificacion, setPlanCorte, getPlanificaciones, quitarModeloPlanificacionPendiente, getPlanificacion, getPCPendientePlanificacion } from '@services/LectraService';
import { useEffect, useState } from 'react';

const usePlanificacion = (autoLoad = true) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])


    const getData = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPendientePlanificacion()
            // console.log(data.data)
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

    const setPlanificacion = async (payload, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await setPlanCorte(payload)
            // console.log(data.data)
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

    const fetchPlanificacions = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPlanificaciones()
            // console.log(data.data)
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

    const fetchPlanificacion = async (operacion, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPlanificacion(operacion)
            // console.log(data.data)
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

    const getPendientesDePlanificarPC = async (withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPCPendientePlanificacion()
            // console.log(data.data)
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

    const eliminarModeloPlanificacion = async (modelo) => {

        setIsLoading(true)

        try {

            const data = await quitarModeloPlanificacionPendiente({ modelo: modelo })
            // console.log(data.data)
            if (withReturn) {
                setIsLoading(false)
                return data
            }

            // console.log(data.data)
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)

        }
    }

    return { response, isLoading, error, getData, eliminarModeloPlanificacion, setPlanificacion, fetchPlanificacions, getPendientesDePlanificarPC, fetchPlanificacion }
}


export default usePlanificacion