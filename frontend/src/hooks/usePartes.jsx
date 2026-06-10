import { getModelos, getPartesByModelo, getPiezasByParte as getPiezasParte } from '../services/ModelService';
import { useEffect } from 'react';
import { useState } from "react";

const usePartes = (autoLoad = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])

    const save = async (payload, onSuccess) => {

        setError(null)
        setIsLoading(true)

        try {
            const dataToSend = { ...payload, id: userData.id }
            const data = await storePostulante(dataToSend)

            if (data.error) {
                setError(data.data[0])
            } else {
                // fetch()
                onSuccess()
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setIsLoading(false)
        }

    }

    const store = (payload, onSuccess) => {
        save(payload, onSuccess)
    }

    const getData = async () => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getModelos()
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const getPartesByModel = async (modeloId, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPartesByModelo(modeloId)
            if (withReturn) {
                setIsLoading(false)
                return data.data
            }
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const getPiezasByParte = async (parteId, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPiezasParte(parteId)
            if (withReturn) {
                setIsLoading(false)
                return data.data
            }
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    return { response, isLoading, error, store, getData, getPiezasByParte, getPartesByModel }
}


export default usePartes