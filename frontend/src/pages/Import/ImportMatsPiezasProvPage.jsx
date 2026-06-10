import Loader from "@components/Loader";
import { useState } from 'react';
import { uploadImportFile } from '../../services/UploadFile';

export default function ImportMatsPiezasProvPage() {

    const [file, setFile] = useState()
    const [isLoading, setIsLoading] = useState(false);
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
        formData.append('fileName', file.name);

        const data = await uploadImportFile("import/materialesproveedores", formData)

        setResponse(data)
        setIsLoading(false)
    }

    return (
        <div>
            <div className='bg-yellow-200 p-2'>
                <span className='font-semibold'>6-IMPORTAR ACTUALIZACION MATERIALES PIEZAS Y PROVEEDORES (6-MatPiezasProvImport.xls)</span>
            </div>

            <div>
                <form className='mt-4 flex gap-5 items-center' onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange} />
                    <button disabled={isLoading} className='disabled:opacity-50 text-sm bg-emerald-500 mt-2 text-white py-1 px-4' type="submit">Importar</button>
                    {isLoading && <div className='flex items-center gap-4'><span className='font-semibold'>Importando</span><Loader /></div>}
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
