import { getKanbanEndOfLine, storeEOL, getReporteInternoFallas, getQrDataEndOfLine } from '@services/FallasService';
import { useState } from 'react';

const useKanbanFallas = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    // useEffect(() => {
    //     if (autoLoad) {
    //         getData();
    //     }
    // }, [])

    const clearResponse = () => {
        setResponse([])
    }

    const fetchEtiquetaData = async (qrEtiqueta, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getQrDataEndOfLine(qrEtiqueta)

            if (withReturn) {
                setIsLoading(false)

                if (data?.error) {
                    setError(data.message)
                    return null
                }

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

    const fetchKanban = async (kanbanCode, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getKanbanEndOfLine(kanbanCode)

            if (withReturn) {
                setIsLoading(false)

                if (data?.error) {
                    setError(data.message)
                    return null
                }

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

    const storeEOLKanban = async (payload, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await storeEOL(payload)

            if (withReturn) {
                setIsLoading(false)

                if (data?.error) {
                    setError(data.message)
                    return null
                }

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

    const fetchDataReporteInternoFallas = async (payload, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getReporteInternoFallas(payload)

            if (withReturn) {
                setIsLoading(false)

                if (data?.error) {
                    setError(data.message)
                    return null
                }

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


    return { response, isLoading, error, clearResponse, fetchKanban, storeEOLKanban, fetchDataReporteInternoFallas, fetchEtiquetaData }
}


export default useKanbanFallas