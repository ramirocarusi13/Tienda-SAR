import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

export default function MessageTimeOut({ statusResponse = null }) {
    const [hidden, setHidden] = useState(true)

    useEffect(() => {
        if (statusResponse) {
            console.log("ENTRO", statusResponse)
            setHidden(false)
            setTimeout(() => {
                setHidden(true)
            }, [3000])
        }
    }, [statusResponse])

    if (hidden) {
        return <div>asdasd</div>
    }

    if (!hidden) {

        return (
            <div className={` w-full`}>
                <div className={`w-full ${statusResponse?.error ? 'bg-error' : 'bg-success'} p-4 text-3xl mt-4 rounded-md text-white`}>
                    <span>{statusResponse?.message}</span>
                </div>
            </div>
        )
    }
}
