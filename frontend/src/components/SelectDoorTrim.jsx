import SelectUseForm from "@components/SelectUseForm";
import { useEffect, useState } from "react";
import { getDoorTrim, getModelos } from "../services/ModelService";
import { Select } from "antd";
import { useQuery } from '@tanstack/react-query'

export default function SelectDoorTrim({ defaultValue = '', onChange = null, className = '', disabled = false, classNameLabel = '', size = 'default', name = 'modelo' }) {
    // const [modelos, setModelos] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchDoorTrim = async () => {
        setIsLoading(true)
        const data = await getDoorTrim()

        // if (!data?.error) {
        //     setModelos(data?.data)
        // }

        setIsLoading(false)

        return data?.data
    }

    const query = useQuery({ queryKey: ['door_trim'], queryFn: fetchDoorTrim, staleTime: 100000, refetchInterval: 500000 })


    useEffect(() => {
        fetchDoorTrim()
    }, [])

    return (
        <div className={className}>
            <Select
                label="Door Trim"
                name={name}
                size={size}
                loading={isLoading}
                placeholder="Seleccione un door trim"
                onChange={onChange}
                className="w-full"
                showSearch={true}
                // searchValue={true}
                optionFilterProp="label"
                // search={true}
                // classNameLabel={classNameLabel}
                disabled={disabled}
                defaultValue={defaultValue}
                value={defaultValue}
                // control={control}
                options={query?.data?.map((d) => { return { value: d.nombre, label: d?.nombre, className: "!text-sm" } })}
            />

        </div>
    )
}
