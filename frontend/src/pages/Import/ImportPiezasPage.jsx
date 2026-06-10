import Loader from "@components/Loader";
import { useState } from 'react';
import { uploadImportFile } from '../../services/UploadFile';

export default function ImportPiezasPage() {

    const [file, setFile] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingUpdateModels, setIsLoadingUpdateModels] = useState(false)
    const [isLoadingUpdatePiezas, setIsLoadingUpdatePiezas] = useState(false)
    const [response, setResponse] = useState(null)

    function handleChange(event) {
        setFile(event.target.files[0])
    }

    function handleChangeUpdate(event) {
        setFile(event.target.files[0])
    }

    function handleChangeUpdateModels(event) {
        setFile(event.target.files[0])
    }

    async function handleSubmit(event) {
        setResponse(null)
        setIsLoading(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        const data = await uploadImportFile("import/piezas", formData)

        setResponse(data)
        setIsLoading(false)
    }

    async function handleSubmitUpdate(event) {
        setResponse(null)
        setIsLoadingUpdate(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        const data = await uploadImportFile("import/piezasupdate", formData)

        setResponse(data)
        setIsLoadingUpdate(false)
    }

    async function handleSubmitUpdateModels(event) {
        setResponse(null)
        setIsLoadingUpdateModels(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        const data = await uploadImportFile("import/modelsupdate", formData)

        setResponse(data)
        setIsLoadingUpdateModels(false)
    }

    async function handleSubmitUpdatPiezasArea(event) {
        setResponse(null)
        setIsLoadingUpdatePiezas(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        const data = await uploadImportFile("import/updatepiezasarea", formData)

        setResponse(data)
        setIsLoadingUpdatePiezas(false)
    }

    return (
        <div>
            <div>
                <div className='bg-yellow-200 p-2'>
                    <span className='font-semibold'>1-IMPORTAR PIEZAS (1-PartesYPiezas.xls)</span>
                </div>

                <div>
                    <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmit}>
                        <input type="file" onChange={handleChange} />
                        <button disabled={isLoading} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                        {isLoading && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                    </form>
                </div>
            </div>

            <div className="mt-10">
                <div className='bg-yellow-200 p-2'>
                    <span className='font-semibold'>4-ACTUALIZAR PIEZAS (4-PiezasOptimoReposicionImport.xls)</span>
                </div>

                <div>
                    <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdate}>
                        <input type="file" onChange={handleChangeUpdate} />
                        <button disabled={isLoadingUpdate} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                        {isLoadingUpdate && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                    </form>
                </div>
            </div>

            <div className="mt-10">
                <div className='bg-yellow-200 p-2'>
                    <span className='font-semibold'>5-ACTUALIZAR MODELOS REVISION/VOLUMEN (5-ModelosRevisionVolumen.xls)</span>
                </div>

                <div>
                    <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdateModels}>
                        <input type="file" onChange={handleChangeUpdateModels} />
                        <button disabled={isLoadingUpdate} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                        {isLoadingUpdateModels && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                    </form>
                </div>
            </div>

            <div className="mt-10">
                <div className='bg-yellow-200 p-2'>
                    <span className='font-semibold'>ACTUALIZAR PIEZAS (AREA)</span>
                </div>

                <div>
                    <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitUpdatPiezasArea}>
                        <input type="file" onChange={handleChangeUpdateModels} />
                        <button disabled={isLoadingUpdate} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                        {isLoadingUpdatePiezas && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                    </form>
                </div>
            </div>

            <div className="w-full">

                {response &&
                    <div className='w-full'>
                        <span className={`${response?.error ? "bg-error " : "bg-success"} text-white font-semibold px-2 block w-full rounded-lg mt-4 py-2`}>{response?.error ? response?.message : "Importado correctamente"}</span>
                    </div>
                }
            </div>

        </div>
    )
}
