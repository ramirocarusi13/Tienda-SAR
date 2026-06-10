import Loader from "@components/Loader";
import { useState } from 'react';
import { uploadImportFile } from '@services/UploadFile';


export default function ImportTiendaPage() {
    const [file, setFile] = useState()
    const [isLoading, setIsLoading] = useState(false);
    // const [isLoadingModFalla, setIsLoadingModFalla] = useState(false);
    const [response, setResponse] = useState(null)

    function handleChange(event) {
        setFile(event.target.files[0])
    }

    async function handleSubmit(event) {
        setResponse(null)
        setIsLoading(true)
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);;

        const data = await uploadImportFile("import/tiendalayout", formData)

        setResponse(data)
        setIsLoading(false)

    }

    // async function handleSubmitModeloFalla(event) {
    //     setResponse(null)
    //     setIsLoadingModFalla(true)
    //     event.preventDefault()
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('fileName', file.name);;

    //     const data = await uploadImportFile("import/codigosfallasmodelo", formData)

    //     setResponse(data)
    //     setIsLoadingModFalla(false)
    // }

    return (
        <div>
            <div className='bg-yellow-200 p-2'>
                <span className='font-semibold'>10-Tienda Layout (10-LayoutTienda.xls)</span>
            </div>

            <div>
                <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange} />
                    <button disabled={isLoading} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                    {isLoading && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                </form>
            </div>


            {/* <div className='bg-yellow-200 p-2 mt-8'>
                <span className='font-semibold'>IMPORTAR CÓDIGO FALLAS POR MODELO</span>
            </div>

            <div>
                <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmitModeloFalla}>
                    <input type="file" onChange={handleChange} />
                    <button disabled={isLoadingModFalla} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                    {isLoadingModFalla && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
                </form>
            </div> */}

            {response &&
                <div className='w-full'>
                    <span className={`${response?.error ? "bg-error " : "bg-success"} text-white font-semibold px-2 block w-full rounded-lg mt-4 py-2`}>{response?.error ? response?.message : "Importado correctamente"}</span>
                </div>
            }
        </div>
    )
}
