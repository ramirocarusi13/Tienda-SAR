
import { getPiezas, getPiezasByKanbanCode, updatePiezaById, getPiezaById } from "@services/PiezaService"
import { useEffect } from 'react';
import { useState } from "react";

const usePiezas = (autoLoad = false) => {
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

    const updatePieza = async (id, payload, onSuccess = null) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await updatePiezaById(id, payload)

            if (data.error) {
                setError(data.message)
            } else {
                if (onSuccess) {
                    onSuccess(data)
                }
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

    const getData = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPiezas()

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

    const getPieza = async (id, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPiezaById(id)

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

    const getPiezasByKanban = async (kanbanCode, esEgreso = true, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPiezasByKanbanCode(kanbanCode, esEgreso)

            // console.log("hook", data)
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

    return { response, isLoading, error, updatePieza, store, getData, getPiezasByKanban, getPieza }
}


export default usePiezas