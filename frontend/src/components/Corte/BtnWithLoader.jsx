import { Spin } from 'antd'
import { useState } from 'react'

export default function BtnWithLoader({ fn, icon, text, className }) {
    const [isLoading, setIsLoading] = useState(false)

    return <button
        onClick={async () => {
            setIsLoading(true)
            await fn()
            setIsLoading(false)
        }}
        className={className}>
        {icon} {text} {isLoading && <Spin />}
    </button>
}
