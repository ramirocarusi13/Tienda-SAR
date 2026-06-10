import { getPendientesCorte } from '@services/LectraService';
import { useEffect, useState } from 'react';

const usePendienteCorte = (autoLoad = true) => {
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

            const data = await getPendientesCorte()
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


    return { response, isLoading, error, getData }
}


export default usePendienteCorte