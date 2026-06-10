import { getPlanActual, getStockModelos, savePlan } from '@services/PcService';
import { useState } from 'react';

const usePcPlan = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    const fetchCurrentPlan = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPlanActual()
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

    const guardarPlan = async (payload, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await savePlan(payload)

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

    const fetchStockModelos = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getStockModelos()
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

    return { response, isLoading, error, guardarPlan, fetchCurrentPlan, fetchStockModelos }
}


export default usePcPlan