import Loader from "@components/Loader";
import { useState } from 'react';
import { uploadImportFile } from '../../services/UploadFile';


export default function ImportDatosCortePage() {
    const [file, setFile] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingUpdate2, setIsLoadingUpdate2] = useState(false);
    const [isLoadingUpdate3, setIsLoadingUpdate3] = useState(false);

    function handleChange(event) {
        setFile(event.target.files[0])
    }

    function handleChangeUpdate(event) {
        setFile(event.target.files[0])
    }

    async function handleSubmitUpdate(event) {
        setResponse(null)
        setIsLoadingUpdate(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);;

        const data = await uploadImportFile("import/updatekanbanpadre", formData)

        setResponse(data)
        setIsLoadingUpdate(false)

    }

    async function handleSubmit(event) {
        setResponse(null)
        setIsLoading(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);;

        const data = await uploadImportFile("import/datoscorte", formData)

        setResponse(data)
        setIsLoading(false)

    }

    async function handleSubmitUpdate2(event) {
        setResponse(null)
        setIsLoadingUpdate2(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);;

        const data = await uploadImportFile("import/updatelectradata", formData)

        setResponse(data)
        setIsLoadingUpdate2(false)

    }

    async function handleSubmitUpdate3(event) {
        setResponse(null)
        setIsLoadingUpdate3(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);;

        const data = await uploadImportFile("import/modelosublinetiempos", formData)

        console.log(data)

        setResponse(data)
        setIsLoadingUpdate3(false)

    }

    return (
        <div>
            <div className='bg-yellow-200 p-2'>
                <span className='font-semibold'>7-IMPORTAR DATOS DE CORTE (7-DatosCorte.xls)</span>
            </div>

            <div>
                <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange} />
                    <button disabled={isLoading} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                    {isLoading && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                </form>
            </div>

            <div className="mt-10">

                <div className='bg-yellow-200 p-2'>
                    <span className='font-semibold'>11-ACTUALIZAR KANBAN PAPÁ (11-ActualizacionKanbanPadre.xls)</span>
                </div>

                <div>
                    <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdate}>
                        <input type="file" onChange={handleChange} />
                        <button disabled={isLoadingUpdate} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                        {isLoadingUpdate && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                    </form>
                </div>
            </div>

            <div className="mt-10">

                <div className='bg-yellow-200 p-2'>
                    <span className='font-semibold'>13-ACTUALIZAR DESDE LECTRA (13-Lectra.xlsx)</span>
                </div>

                <div>
                    <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdate2}>
                        <input type="file" onChange={handleChange} />
                        <button disabled={isLoadingUpdate2} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                        {isLoadingUpdate2 && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                    </form>
                </div>
            </div>

            <div className="mt-10">

                <div className='bg-yellow-200 p-2'>
                    <span className='font-semibold'>14-TIEMPOS SUBLINE MODELOS (14-ModelosTiemposSubline.xls)</span>
                </div>

                <div>
                    <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdate3}>
                        <input type="file" onChange={handleChange} />
                        <button disabled={isLoadingUpdate3} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                        {isLoadingUpdate3 && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                    </form>
                </div>
            </div>

            {response &&
                <div className='w-full'>
                    <span className={`${response?.error ? "bg-error " : "bg-success"} text-white font-semibold px-2 block w-full rounded-lg mt-4 py-2`}>{response?.error ? response?.message : "Importado correctamente"}</span>
                </div>
            }
        </div>
    )
}
