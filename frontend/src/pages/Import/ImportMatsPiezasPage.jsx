import Loader from "@components/Loader";
import { useState } from 'react';
import { uploadImportFile } from '../../services/UploadFile';


export default function ImportMatsPiezasPage() {
    const [file, setFile] = useState()
    const [fileUpdate, setFileUpdate] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingUpdate2, setIsLoadingUpdate2] = useState(false);
    const [response, setResponse] = useState(null)


    function handleChange(event) {
        setFile(event.target.files[0])
    }

    function handleChangeUpdate(event) {
        setFileUpdate(event.target.files[0])
    }

    function handleChangeUpdate2(event) {
        setFileUpdate(event.target.files[0])
    }

    async function handleSubmit(event) {
        setResponse(null)
        setIsLoading(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);;

        const data = await uploadImportFile("import/materialespiezas", formData)

        setResponse(data)
        setIsLoading(false)

    }

    async function handleSubmitUpdate(event) {
        setResponse(null)
        setIsLoadingUpdate(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', fileUpdate);
        formData.append('fileName', fileUpdate.name);;

        const data = await uploadImportFile("import/materialespiezasupdate", formData)

        setResponse(data)
        setIsLoadingUpdate(false)

    }

    async function handleSubmitUpdate2(event) {
        setResponse(null)
        setIsLoadingUpdate2(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', fileUpdate);
        formData.append('fileName', fileUpdate.name);;

        const data = await uploadImportFile("import/cuerosconcantidad", formData)

        setResponse(data)
        setIsLoadingUpdate2(false)

    }

    return (
        <div>
            <div className='bg-yellow-200 p-2'>
                <span className='font-semibold'>2-IMPORTAR MATERIALES PIEZAS (2-MaterialesPiezas.xls)</span>
            </div>

            <div>
                <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange} />
                    <button disabled={isLoading} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                    {isLoading && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                </form>
            </div>

            <div className='bg-yellow-200 p-2 mt-10'>
                <span className='font-semibold'>3-ACTUALIZA MATERIALES PIEZAS DENSIDAD/ANCHO (3-MaterialesPiezasDensidadAncho.xls)</span>
            </div>

            <div>
                <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdate}>
                    <input type="file" onChange={handleChangeUpdate} />
                    <button disabled={isLoadingUpdate} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                    {isLoadingUpdate && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                </form>
            </div>

            <div className='bg-yellow-200 p-2 mt-10'>
                <span className='font-semibold'>IMPORTAR CUEROS CON CANTIDAD</span>
            </div>

            <div>
                <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdate2}>
                    <input type="file" onChange={handleChangeUpdate2} />
                    <button disabled={isLoadingUpdate2} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                    {isLoadingUpdate2 && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                </form>
            </div>

            {response &&
                <div className='w-full'>
                    <span className={`${response?.error ? "bg-error " : "bg-success"} text-white font-semibold px-2 block w-full rounded-lg mt-4 py-2`}>{response?.error ? response?.message : "Importado correctamente"}</span>
                </div>
            }
        </div>
    )
}
