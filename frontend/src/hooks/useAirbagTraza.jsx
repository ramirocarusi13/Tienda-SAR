import { useState } from 'react';
import { getTrazabilidadAirbag } from '../services/AirbagService';

const useAirbagTraza = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    // useEffect(() => {
    //     if (autoload) {
    //         getData();
    //     }
    // }, [])


    const getData = async (codigo) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getTrazabilidadAirbag(codigo)
            setResponse(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }


    return { response, isLoading, error, getData }

}



export default useAirbagTraza