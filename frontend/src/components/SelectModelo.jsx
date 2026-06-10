import { useQuery } from '@tanstack/react-query';
import { Select } from "antd";
import { useEffect } from "react";
import { getModelos, getModelosWms } from "../services/ModelService";

export default function SelectModelo({ defaultValue = null, onChange = null, className = '', disabled = false, classNameSelect = '', size = 'default', name = 'modelo', multiple = false, modoTactil = false, allowClear = false, line = null }) {
    // const [modelos, setModelos] = useState([])
    // const [isLoading, setIsLoading] = useState(false)

    // console.log(line)
    const fetchModelos = async () => {
        // setIsLoading(true)
        const data = await getModelosWms()
        // console.log(data?.data)
        // setIsLoading(false)

        if (line) {
            return data?.data?.filter(m => m?.lineas?.find(i => i.id == line))
        } else {
            return data?.data
        }
    }

    const query = useQuery({ queryKey: ['modelos'], queryFn: fetchModelos, staleTime: 100000, refetchInterval: 500000 })


    useEffect(() => {
        fetchModelos()
    }, [])

    // console.log(query?.data)

    return (
        <div className={className}>
            <Select
                label="Modelo"
                name={name}
                size={size}
                mode={multiple ? "multiple" : undefined}
                loading={query?.isLoading}
                placeholder="Seleccione un modelo"
                onChange={onChange}
                className={`w-full py-2 ${classNameSelect}`}
                popupClassName={`${modoTactil && '!text-3xl'}`}
                rootClassName={`${modoTactil && '!text-2xl !py-3'}`}
                showSearch={true}
                allowClear={allowClear}
                // searchValue={true}
                optionFilterProp="label"
                // search={true}
                // classNameLabel={'!py-10'}
                disabled={disabled}
                // defaultValue={defaultValue}
                value={defaultValue == '' ? null : defaultValue}
                listHeight={modoTactil ? 500 : 256}
                // control={control}
                options={query?.data?.map((d) => { return { value: d.nombre, label: d?.nombre, className: `${modoTactil ? "!text-3xl" : "!text-sm"}` } })}
            />

        </div>
    )
}
