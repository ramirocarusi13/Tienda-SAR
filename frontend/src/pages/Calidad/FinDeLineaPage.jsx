import DrawItem from '@components/DrawItem';
import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import useFallas from '@hooks/useFallas';
import useKanbanFallas from '@hooks/useKanbanFallas';
import { validaUsuarioPorCodigoValidacion } from "@services/AuthService";
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";


const getClickCoords = (event) => {
    var e = event.target;
    var dim = e.getBoundingClientRect();
    var x = event.clientX - dim.left - 10;
    var y = event.clientY - dim.top - 10;

    x = (x * 100) / dim.width
    y = (y * 100) / dim.height

    return [x, y];
};

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let letters2 = 'ABCDEF';
    let color = ''
    for (var i = 0; i < 6; i++) {
        // if (i == 0 || i == 2) {
        //     color += letters2[Math.floor(Math.random() * 6)];
        // } else {
        color += letters[Math.floor(Math.random() * 16)];
        // }
    }

    // console.log(color)

    return color;
}

export default function FinDeLineaPage() {

    const [circlesData, setCirclesData] = useState([])
    const [fallaSel, setFallaSel] = useState(null)
    const [fallasModelo, setFallasModelo] = useState(null)
    const [lError, setLError] = useState(null)
    const [userError, setUserError] = useState(null)
    const [isLoadingUser, setIsLoadingUser] = useState(false)

    const [currentImage, setCurrentImage] = useState({
        image: null,
        typeId: null,
        id: null
    })
    const { register, control, setFocus, setValue, reset, formState: { errors } } = useForm();

    const [dataKanban, setDataKanban] = useState(null)
    const { isLoading, fetchKanban, error, storeEOLKanban, fetchEtiquetaData } = useKanbanFallas()
    const { isLoading: isLoadingFalla, response: fallas } = useFallas(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userVigente, setUserVigente] = useState(null)


    // const { register, control, handleSubmit, formState: { errors }, setFocus, setValue, getValues } = useForm();

    const deleteCircle = (id) => {
        const exists = circlesData.filter(c => parseInt(c.id) == parseInt(id))
        let circs

        if (exists?.length > 0) {
            if (exists[0].cantidad <= 1) {
                circs = circlesData.filter(c => parseInt(c.id) != parseInt(id))
            } else {
                circs = circlesData.filter(c => parseInt(c.id) != parseInt(id))
                circs = [...circs, { ...exists[0], cantidad: exists[0].cantidad - 1 }]
            }
        }

        setCirclesData(circs)
    }

    const addCircle = (event) => {
        if (!fallaSel) {
            return
        }

        if (event.target.className?.includes("div-circle-falla")) {
            let cid = event.target.id

            const exists = circlesData.filter(c => parseInt(c.id) == parseInt(cid))
            if (!exists) {
                return;
            }

            let cTemp = circlesData.filter(c => parseInt(c.id) != parseInt(cid))

            cTemp = [...cTemp, { ...exists[0], cantidad: exists[0].cantidad + 1 }]
            setCirclesData(cTemp)

            return
        }

        let [x, y] = getClickCoords(event);
        const id = Math.floor(Math.random() * 999);

        let circle = {
            id,
            x: parseInt(x),
            y: parseInt(y),
            screenX: event.screenX,
            screenY: event.screenY,
            falla: fallaSel,
            cantidad: 1,
            color: getRandomColor(),
            type: currentImage.typeId,
            lado: currentImage.ladoId,
            typeName: currentImage.type,
            imageId: currentImage.id
        }

        let c = [...circlesData, circle]
        setCirclesData(c)
    };

    const getTipo = (tipo) => {

        if (tipo == 'BC') {
            return 'BACK'
        } else if (tipo == 'CS') {
            return 'CUSHION'
        } else {
            return ''
        }

    }

    const fetchData = async (scan) => {
        setLError(null)
        // console.log(finalText)
        // const data = await fetchEtiquetaData('202414111760271073-0KQ11-C4FRRHBC21SAR001', true)
        const data = await fetchEtiquetaData(scan?.replaceAll("'", "-"), true)

        setValue("etiqueta", null)
        if (!data?.data) {
            setDataKanban(null)
        } else {

            // console.log(data?.data)
            setDataKanban(data?.data)

            const fallasTmp = []

            if (data?.data?.modelod?.fallas?.length > 0) {
                data?.data?.modelod?.fallas?.forEach(f => {
                    if (f?.lado?.lado?.toUpperCase() == data?.data?.lado?.toUpperCase() && f?.tipo?.tipo?.toUpperCase() == getTipo(data?.data?.tipo)) {
                        fallasTmp.push(f)
                    }
                })
            } else {
                setDataKanban(null)
                setLError("El modelo de la etiqueta no se encuentra disponible.")
            }

            setFallasModelo(fallasTmp)

            if (fallasTmp?.length > 0) {
                setCurrentImage({
                    id: fallasTmp[0]?.id,
                    image: fallasTmp[0]?.imagen,
                    typeId: fallasTmp[0]?.tipo?.id,
                    type: fallasTmp[0]?.tipo?.tipo,
                    ladoId: fallasTmp[0]?.lado?.id,
                })
            }
        }
    }

    const resetData = () => {
        setCirclesData([])
        setFallaSel(null)
        setDataKanban(null)
        setCurrentImage(null)

        setTimeout(() => {
            setFocus("etiqueta")
        }, 50)
    }

    const confirm = async () => {
        const payload = {
            circles: circlesData,
            qr: dataKanban?.qr,
            user: userVigente?.id
        }

        const data = await storeEOLKanban(payload, true)

        if (data.error) {

        } else {
            resetData()
            setIsModalOpen(false)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if (userVigente) {
                setFocus("etiqueta")
            } else {
                setFocus("cod_autorizacion")
            }
        }, 50)
    }, [])

    const clear = (withUser = true) => {
        setValue("etiqueta", null)
        setDataKanban(null)

        if (withUser) {
            setUserVigente(null)
            setTimeout(() => { setFocus("cod_autorizacion") }, [50])

        } else {
            setTimeout(() => { setFocus("etiqueta") }, [50])
        }
    }

    return (
        <div className='p-2 flex items-start flex-col justify-start min-h-[100vh] '>

            <Modal
                closable={false}
                footer={[]}
                open={!userVigente}
            >
                <InputUseForm
                    name="cod_autorizacion"
                    label="Ingrese el código de autorización"
                    className="w-full"
                    register={register}
                    type="password"
                    errors={errors}
                    placeholder="Código de autorización"
                    classNameInput="!text-3xl !py-4 !border-2 !border-black"
                    onKeyPress={async (e) => {
                        if (e.key == 'Enter' && e.target.value != '') {
                            setUserError(null)
                            setIsLoadingUser(true)
                            const response = await validaUsuarioPorCodigoValidacion(e.target.value)
                            e.target.value = ''

                            if (response?.error) {
                                setUserError(response.message)

                                setIsLoadingUser(false)
                                setValue("cod_autorizacion", null)
                                setTimeout(() => { setFocus("cod_autorizacion") }, [50])
                            } else {
                                setUserVigente(response?.data)
                                setIsLoadingUser(false)
                                setTimeout(() => { setFocus("etiqueta") }, [50])
                            }
                        }
                    }}
                />

                {isLoadingUser && <div className="flex items-center justify-center mt-5"><Loader /></div>}
                {userError && <span className="text-red-500 font-semibold">{userError}</span>}
            </Modal>

            {!dataKanban &&
                <div className='flex flex-col items-center gap-4 justify-center w-full min-h-[70vh] '>
                    <div className='flex flex-col items-center gap-4 justify-center w-full '>
                        <span className='text-7xl font-bold'>CONTROL DE FIN DE LÍNEA</span>
                        <span className='text-6xl'>ESCANEE LA ETIQUETA</span>

                        <InputUseForm
                            label=""
                            name="etiqueta"
                            className="w-full !bg-white"
                            classNameInput='!bg-white !py-4 !text-2xl !border-2'
                            register={register}
                            errors={errors}
                            placeholder="Etiqueta"
                            onKeyPress={async (e) => {
                                if (e.key == 'Enter') {
                                    // console.log(dataValidation)
                                    fetchData(e.target.value)
                                }
                            }}
                        // rules={{ required: "Ingrese el consumo del material" }}
                        />


                        {userVigente &&
                            <div className='w-full bg-yellow-400 text-center flex items-center justify-center gap-2 left-0 bottom-0 fixed z-20'>
                                <span className='block p-2 text-lg text-black font-semibold'>INSPECTOR : {userVigente?.email?.toUpperCase()}</span>
                                <button onClick={() => clear()} className='p-0 px-4 text-lg'>SALIR</button>
                            </div>
                        }
                    </div>

                    {error &&
                        <div className='flex flex-col items-center gap-4 justify-center w-full  '>
                            <span className='text-7xl font-bold bg-red-500 block w-full px-2 py-5 text-center text-white'>{error?.toUpperCase()}</span>
                        </div>
                    }

                    {lError &&
                        <div className='flex flex-col items-center gap-4 justify-center w-full  '>
                            <span className='text-7xl font-bold bg-red-500 block w-full px-2 py-5 text-center text-white'>{lError?.toUpperCase()}</span>
                        </div>
                    }
                </div>
            }

            {isLoading && <div className='w-full flex items-center justify-center'><Loader fontSize={120} /></div>}

            {(dataKanban && !isLoading) &&
                <div className='w-full flex flex-col items-start mt-2 px-2  h-full'>
                    <div className='bg-black text-white rounded-md w-full px-4 p-2 gap-4 flex items-center justify-between'>
                        <div className='w-full flex items-center gap-4'>
                            <span className='text-xl font-bold'>MODELO: {dataKanban?.modelo}</span>
                            <span className='text-xl font-bold'>-</span>
                            <span className='text-xl font-bold'>{getTipo(dataKanban?.tipo)} {dataKanban?.lado}</span>
                            <span className='text-xl font-bold'>-</span>
                            <span className='text-xl font-bold'>SEC: {dataKanban.secuencia}</span>
                            <span className='text-xl font-bold'>-</span>
                            <span className='text-xl font-bold'>UBICACIÓN: {dataKanban.ubicacion}</span>
                            {dataKanban?.linea && <span className='text-xl font-bold'>-</span>}
                            {dataKanban?.linea && <span className='text-xl font-bold'>LINEA: M{dataKanban?.linea}</span>}
                            {/* <span className='text-xl font-bold'>-</span>
                            <span className='text-xl font-bold'>ESTADO: {dataKanban.estado}</span> */}
                        </div>

                        <div className='min-w-[300px] text-end '>
                            <span className='text-xl font-bold'>INSPECTOR: {userVigente?.email?.toUpperCase()}</span>

                        </div>
                    </div>

                    <div className='w-full flex items-start mt-2 px-2 h-full'>
                        <div className='w-full gap-4 flex flex-col items-center px-2 py-2'>
                            {isLoadingFalla && <Loader />}
                            {!isLoadingFalla && <div className='grid grid-cols-5 w-full gap-2 '>
                                {fallas?.map((f, idx) => (
                                    <button
                                        key={`falla-${idx}`}
                                        onClick={() => setFallaSel(f)}
                                        className={`${fallaSel?.codigo == f.codigo ? 'bg-green-500' : 'bg-yellow-200'} text-xs min-h-14`}>
                                        {f.codigo}- {f.nombre}
                                    </button>
                                ))}
                            </div>
                            }

                            {!isLoadingFalla &&
                                <Table
                                    size='small'
                                    rowKey={row => row.id}
                                    className='w-full'
                                    dataSource={circlesData}
                                    columns={[
                                        {
                                            title: "Falla",
                                            key: 'falla',
                                            dataIndex: 'falla',
                                            render: (_, record) => <div className='flex gap-2'><div style={{ backgroundColor: `#${record.color}` }} className={`w-5 h-5 rounded-full`}></div>{record?.falla?.codigo + " - " + record?.falla?.nombre}</div>
                                        },
                                        {
                                            title: "Cantidad",
                                            key: 'cantidad',
                                            dataIndex: 'cantidad'
                                        },
                                        // {
                                        //     title: "Tipo",
                                        //     key: "typeName",
                                        //     dataIndex: "typeName",
                                        //     // render: (text) => {
                                        //     //     if (text == 'B') {
                                        //     //         return 'BACK'
                                        //     //     } else if (text == 'C') {
                                        //     //         return "CUSHION"
                                        //     //     } else {
                                        //     //         return ""
                                        //     //     }
                                        //     // }
                                        // }
                                    ]}
                                />
                            }
                        </div>

                        <div className='w-[60%] h-[88vh] flex flex-col items-start gap-2 mt-2'>
                            <div className='flex items-center gap-2 w-full'>

                                {fallasModelo.map((f, idx) => (
                                    <button
                                        key={`bnt-${idx}`}
                                        onClick={() => {
                                            setCurrentImage({
                                                id: f.id,
                                                image: f.imagen,
                                                typeId: f?.tipo?.id,
                                                ladoId: f?.lado?.id,
                                                type: f?.tipo?.tipo
                                            })
                                        }}
                                        className={`text-sm w-full ${currentImage.id == f.id && 'bg-blue-200'}`}
                                    >
                                        {f?.nombre}
                                    </button>

                                ))}
                            </div>
                            <DrawItem image={currentImage} circles={circlesData} addCircle={addCircle} deleteCircle={deleteCircle} />

                            <div className='flex items-center gap-2 w-full'>
                                <button onClick={() => setIsModalOpen(true)} className='w-full bg-green-500'>CONFIRMAR</button>
                                <button onClick={resetData} className='w-full bg-red-500'>CANCELAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <Modal
                width={600} title={<span className='text-2xl'>Confirmar control de calidad</span>} open={isModalOpen}
                footer={[
                    <div className='w-full flex gap-4 items-center justify-center mt-4'>
                        <button onClick={() => setIsModalOpen(false)} className='bg-red-500 px-10 py-5'>CANCELAR</button>
                        <button onClick={confirm} className='bg-success px-10 py-5'>CONFIRMAR</button>
                    </div>
                ]}
            >
                <div className='flex flex-col gap-2'>
                    <p className='text-lg font-semibold'>¿Está seguro que desea confirmar el control de calidad?</p>
                    <p className='text-lg bg-yellow-400 px-2 py-3 font-semibold'>Fallas informadas : {circlesData?.length}</p>
                </div>
            </Modal>
        </div>
    )
}

