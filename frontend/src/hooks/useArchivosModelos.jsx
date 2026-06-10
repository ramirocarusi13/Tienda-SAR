import { getModelos, deleteImagenFalla, setArchivosFallas, getArchivosFallas, getArchivos } from '@services/ModelService';
import { useEffect } from 'react';
import { useState } from "react";

const useArchivosModelos = (autoLoad = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])


    const deleteImageFalla = async (id) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await deleteImagenFalla(id)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const storeImagenFallaModelo = async (payload, onSuccess = null) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await setArchivosFallas(payload)

            if (data.error) {
                setError(data.message)
            } else {
                // fetch()
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

    const fetchImagenesFallas = async (modelId) => {

        setError(null)
        setIsLoading(true)

        try {
            const data = await getArchivosFallas(modelId)

            // if (withReturn) {
            //     setIsLoading(false)
            //     return data

            // }
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

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



    const getData = async (id = null, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {
            const data = await getArchivos(id)

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


    return { response, isLoading, error, deleteImageFalla, store, storeImagenFallaModelo, getData, fetchImagenesFallas }
}


export default useArchivosModelos