import Loader from "@components/Loader";
import { useState } from 'react';
import { uploadImportFile } from '../../services/UploadFile';

export default function ActualizarTiemposPage() {
    const [file, setFile] = useState()
    const [response, setResponse] = useState(null)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    async function handleSubmitUpdate(event) {
        setResponse(null)
        setIsLoadingUpdate(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);;

        const data = await uploadImportFile("import/updatekanbanpadre", formData)

        console.log(data)
        setResponse(data)
        setIsLoadingUpdate(false)

    }

    function handleChange(event) {
        setFile(event.target.files[0])
    }
    return (
        <div className="flex flex-col items-start">
            <span className='font-semibold text-base border-b w-full pb-2'>ACTUALIZACIÓN DE TIEMPOS DE DADOS DE CORTE</span>

            <div>
                <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdate}>
                    <input type="file" onChange={handleChange} disabled={isLoadingUpdate} />
                    <button disabled={isLoadingUpdate} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                    {isLoadingUpdate && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                </form>
            </div>
            {(!isLoadingUpdate && response) &&
                <div className="mt-5 w-full">
                    <span className={`text-xl ${response?.error ? 'bg-red-500' : 'bg-green-600'} block w-full p-2 rounded-md font-semibold text-white`}>{response?.error ? response?.message : 'ACTUALIZADO CORRECTAMENTE'}</span>
                </div>
            }

        </div>
    )
}
