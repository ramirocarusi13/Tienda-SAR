import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OperationLinea from "../../components/PanelOperaciones/OperationLinea";
import useLineaOperaciones from "../../hooks/useLineaOperaciones";
import SelectUseForm from "@components/SelectUseForm";

// const operaciones = [
//     {
//         linea: 0,

//     },
//     {
//         linea: 'M1',
//         operations: [
//             {
//                 name: 'OP#9',
//                 level: 'A',
//                 orden: 1
//             },
//             {
//                 name: 'OP#8',
//                 level: 'S',
//                 orden: 2
//             },
//             {
//                 name: 'OP#7',
//                 level: 'A',
//                 orden: 3
//             },
//             {
//                 name: 'OP#6',
//                 level: 'S',
//                 orden: 4
//             },
//             {
//                 name: 'OP#5',
//                 level: 'D',
//                 orden: 5
//             },
//             {
//                 name: 'OP#4',
//                 level: 'B',
//                 orden: 6
//             },
//             {
//                 name: 'OP#3',
//                 level: 'B',
//                 orden: 7
//             },
//             {
//                 name: 'OP#2',
//                 level: 'C',
//                 orden: 8
//             },
//             {
//                 name: 'OP#1',
//                 level: 'B',
//                 orden: 9
//             },
//             {
//                 name: '',
//                 level: '',
//                 disabled: true,
//                 orden: 10
//             }
//         ],

//     },
//     {
//         linea: 'M2',
//         operations: [
//             {
//                 name: 'OP#7',
//                 level: 'A',
//                 orden: 1
//             },
//             {
//                 name: 'OP#6',
//                 level: 'S',
//                 orden: 2
//             },
//             {
//                 name: 'OP#5',
//                 level: 'S',
//                 orden: 3
//             },
//             {
//                 name: 'OP#4',
//                 level: 'S',
//                 orden: 4
//             },
//             {
//                 name: '',
//                 level: '',
//                 disabled: true,
//                 orden: 5
//             },
//             {
//                 name: 'OP#3',
//                 level: 'B',
//                 orden: 6
//             },
//             {
//                 name: 'OP#2',
//                 level: 'B',
//                 orden: 7
//             },
//             {
//                 name: 'OP#1',
//                 level: 'B',
//                 orden: 8
//             },
//             {
//                 name: '',
//                 level: '',
//                 disabled: true,
//                 orden: 9
//             },
//             {
//                 name: '',
//                 level: '',
//                 disabled: true,
//                 orden: 10
//             }
//         ],
//     },
//     {
//         linea: 'M3',
//         operations: [
//             {
//                 name: 'OP#2',
//                 level: 'A',
//                 orden: 1
//             },
//             {
//                 name: 'OP#1',
//                 level: 'B',
//                 orden: 2
//             },
//             {
//                 name: '',
//                 level: '',
//                 disabled: true,
//                 orden: 3
//             },
//             {
//                 name: '',
//                 level: '',
//                 disabled: true,
//                 orden: 4
//             },
//             {
//                 name: 'S OP#3',
//                 level: 'B',
//                 disabled: true,
//                 orden: 5
//             },
//             {
//                 name: 'OP#2',
//                 level: 'A',
//                 orden: 6
//             },
//             {
//                 name: 'OP#1',
//                 level: 'A',
//                 orden: 7
//             },
//             {
//                 name: '',
//                 level: '',
//                 orden: 8,
//                 disabled: true
//             },
//             {
//                 name: 'S OP#2',
//                 level: 'B',
//                 orden: 9
//             },
//             {
//                 name: 'S OP#1',
//                 level: 'C',
//                 orden: 10
//             }
//         ],
//     },
//     {
//         linea: 'S1',
//         operations: [
//             {
//                 name: 'OP#10',
//                 level: 'B',
//                 orden: 1
//             },
//             {
//                 name: 'OP#9',
//                 level: 'C',
//                 orden: 2
//             },
//             {
//                 name: 'OP#8',
//                 level: 'B',
//                 orden: 3
//             },
//             {
//                 name: 'OP#7',
//                 level: 'B',
//                 orden: 4
//             },
//             {
//                 name: 'OP#6',
//                 level: 'S',
//                 orden: 5
//             },
//             {
//                 name: 'OP#5',
//                 level: 'B',
//                 orden: 6
//             },
//             {
//                 name: 'OP#4',
//                 level: 'C',
//                 orden: 7
//             },
//             {
//                 name: 'OP#3',
//                 level: 'B',
//                 orden: 8
//             },
//             {
//                 name: 'OP#2',
//                 level: 'B',
//                 orden: 9
//             },
//             {
//                 name: 'OP#1',
//                 level: 'S',
//                 orden: 10
//             }
//         ],
//     },
//     {
//         linea: 'S2',
//         operations: [
//             {
//                 name: 'OP#7',
//                 level: 'D',
//                 orden: 1
//             },
//             {
//                 name: 'OP#6',
//                 level: 'C',
//                 orden: 2
//             },
//             {
//                 name: 'OP#5',
//                 level: 'S',
//                 orden: 3
//             },
//             {
//                 name: 'OP#4',
//                 level: 'D',
//                 orden: 4
//             },
//             {
//                 name: '',
//                 level: '',
//                 orden: 5
//             },
//             {
//                 name: 'OP#3',
//                 level: 'C',
//                 orden: 6
//             },
//             {
//                 name: 'OP#2',
//                 level: 'C',
//                 orden: 7
//             },
//             {
//                 name: 'OP#1',
//                 level: 'S',
//                 orden: 8
//             },
//             {
//                 name: '',
//                 level: '',
//                 orden: 9
//             },
//             {
//                 name: '',
//                 level: '',
//                 orden: 10
//             }
//         ],
//     },
//     {
//         linea: 'M4',
//         operations: [
//             {
//                 name: 'R/B OP#1',
//                 level: 'A',
//                 orden: 1
//             },
//             {
//                 name: 'R/B OP#1',
//                 level: 'C',
//                 orden: 2
//             },
//             {
//                 name: '',
//                 level: '',
//                 orden: 3
//             },
//             {
//                 name: '',
//                 level: '',
//                 orden: 4
//             },
//             {
//                 name: 'OP#3',
//                 level: 'D',
//                 orden: 5
//             },
//             {
//                 name: 'R/C OP#2',
//                 level: 'A',
//                 orden: 6
//             },
//             {
//                 name: 'R/C OP#1',
//                 level: 'C',
//                 orden: 7
//             },
//             {
//                 name: '',
//                 level: '',
//                 orden: 8
//             },
//             {
//                 name: 'S OP#2',
//                 level: 'C',
//                 orden: 9
//             },
//             {
//                 name: 'S OP#1',
//                 level: 'C',
//                 orden: 10
//             }
//         ],
//     },
// ]

const lineas = [
    {
        linea: 0,
        operadores: [
            {
                nombre: 'CRISTIAN RAMIREZ',
                operacion: '',
                orden: 1,
                level: 'B'
            },
            {
                nombre: 'RAUL GIMENEZ',
                operacion: '',
                orden: 2,
                level: 'C'
            },
            {
                nombre: '',
                operacion: '',
                orden: 3,
            }
        ]
    },
    {
        linea: 'M1',
        teamLeader: 'RAÚL GIMENEZ',
        operadores: [
            {
                nombre: 'JOFRE SANTIAGO',
                operacion: 'OP2',
                orden: 1,
                level: 'A'
            },
            {
                nombre: 'AGUIRRE IVAN',
                operacion: 'OP1',
                orden: 2,
                level: 'B'
            },
            {
                nombre: '',
                operacion: '',
                orden: 3,
            },
            {
                nombre: '',
                operacion: '',
                orden: 4,
            },
            {
                nombre: 'ZARATE JONATHAN',
                operacion: 'OP5',
                orden: 5,
                level: 'C'
            },
            {
                nombre: 'PEREZ GISELA',
                operacion: 'OP4',
                orden: 6,
                level: 'A'
            },
            {
                nombre: 'SAINTPEE AGUSTIN',
                operacion: 'OP2',
                orden: 7,
                level: 'D'
            },
            {
                nombre: 'VERA ROCIO',
                operacion: 'OP1',
                orden: 8,
                level: 'D'
            },
            {
                nombre: 'CUELAR MARIA',
                operacion: 'OP3',
                orden: 9,
                level: 'C'
            },
            {
                nombre: '',
                operacion: '',
                orden: 10,
                level: ''
            },

        ]
    },
    {
        linea: 'M2',
        teamLeader: 'CAMPOS LUCAS',
        operadores: [
            {
                nombre: 'JOFRE SANTIAGO',
                operacion: 'OP2',
                orden: 1,
                level: 'A'
            },
            {
                nombre: 'AGUIRRE IVAN',
                operacion: 'OP1',
                orden: 2,
                level: 'B'
            },
            {
                nombre: '',
                operacion: '',
                orden: 3,
                level: 'C'
            },
            {
                nombre: 'ZARATE JONATHAN',
                operacion: 'OP5',
                orden: 4,
                level: 'A'
            },
            {
                nombre: '',
                operacion: '',
                orden: 5,
            },
            {
                nombre: 'PEREZ GISELA',
                operacion: 'OP4',
                orden: 6,
                level: 'D'
            },
            {
                nombre: 'SAINTPEE AGUSTIN',
                operacion: 'OP2',
                orden: 7,
                level: 'B'
            },
            {
                nombre: 'VERA ROCIO',
                operacion: 'OP1',
                orden: 8,
                level: 'C'
            },
            {
                nombre: '',
                operacion: '',
                orden: 9,
            },
            {
                nombre: '',
                operacion: '',
                orden: 10,
                level: ''
            },
        ]
    },
    {
        linea: 'M3',
        teamLeader: 'CAMPOS LUCAS',
        operadores: [
            {
                nombre: 'JOFRE SANTIAGO',
                operacion: 'OP2',
                orden: 1,
                level: 'A'
            },
            {
                nombre: 'AGUIRRE IVAN',
                operacion: 'OP1',
                orden: 2,
                level: 'B'
            },
            {
                nombre: '',
                operacion: '',
                orden: 3,
            },
            {
                nombre: '',
                operacion: '',
                orden: 4,
            },
            {
                nombre: 'ZARATE JONATHAN',
                operacion: 'OP5',
                orden: 5,
                level: 'D'
            },
            {
                nombre: 'PEREZ GISELA',
                operacion: 'OP4',
                orden: 6,
                level: 'D'
            },
            {
                nombre: 'SAINTPEE AGUSTIN',
                operacion: 'OP2',
                orden: 7,
                level: 'S'
            },
            {
                nombre: '',
                operacion: '',
                orden: 8,
            },
            {
                nombre: '',
                operacion: '',
                orden: 9,
            },
            {
                nombre: 'CUELAR MARIA',
                operacion: 'OP3',
                orden: 10,
                level: 'A'
            },
        ]
    },
    {
        linea: 'S1',
        teamLeader: 'CAMPOS LUCAS',
        operadores: [
            {
                nombre: 'JOFRE SANTIAGO',
                operacion: 'OP2',
                orden: 1,
                level: 'A'
            },
            {
                nombre: 'AGUIRRE IVAN',
                operacion: 'OP1',
                orden: 2,
                level: 'A'
            },
            {
                nombre: '',
                operacion: '',
                orden: 3,
            },
            {
                nombre: '',
                operacion: '',
                orden: 4,
            },
            {
                nombre: 'ZARATE JONATHAN',
                operacion: 'OP5',
                orden: 5,
                level: 'C'
            },
            {
                nombre: 'PEREZ GISELA',
                operacion: 'OP4',
                orden: 6,
                level: 'D'
            },
            {
                nombre: 'SAINTPEE AGUSTIN',
                operacion: 'OP2',
                orden: 7,
                level: 'S'
            },
            {
                nombre: 'VERA ROCIO',
                operacion: 'OP1',
                orden: 8,
                level: 'B'
            },
            {
                nombre: '',
                operacion: '',
                orden: 9,
            },
            {
                nombre: 'CUELAR MARIA',
                operacion: 'OP3',
                orden: 10,
                level: 'B'
            },
        ]
    },
    {
        linea: 'S2',
        teamLeader: 'CAMPOS LUCAS',
        operadores: [
            {
                nombre: 'JOFRE SANTIAGO',
                operacion: 'OP2',
                orden: 1,
                level: 'D'
            },
            {
                nombre: 'AGUIRRE IVAN',
                operacion: 'OP1',
                orden: 2,
                level: 'C'
            },
            {
                nombre: '',
                operacion: '',
                orden: 3,
            },
            {
                nombre: '',
                operacion: '',
                orden: 4,
            },
            {
                nombre: '',
                operacion: '',
                orden: 5,
            },
            {
                nombre: 'PEREZ GISELA',
                operacion: 'OP4',
                orden: 6,
                level: 'A'
            },
            {
                nombre: 'SAINTPEE AGUSTIN',
                operacion: 'OP2',
                orden: 7,
                level: 'A'
            },
            {
                nombre: 'VERA ROCIO',
                operacion: 'OP1',
                orden: 8,
                level: 'A'
            },
            {
                nombre: '',
                operacion: '',
                orden: 9,
                level: 'A'
            },
            {
                nombre: '',
                operacion: '',
                orden: 10,
                level: 'A'
            },
        ]
    },
    {
        linea: 'M4',
        teamLeader: 'CAMPOS LUCAS',
        operadores: [
            {
                nombre: 'JOFRE SANTIAGO',
                operacion: 'OP2',
                orden: 1,
                level: 'A'
            },
            {
                nombre: 'AGUIRRE IVAN',
                operacion: 'OP1',
                orden: 2,
                level: 'D'
            },
            {
                nombre: '',
                operacion: '',
                orden: 3,
            },
            {
                nombre: '',
                operacion: '',
                orden: 4,
            },
            {
                nombre: 'ZARATE JONATHAN',
                operacion: 'OP5',
                orden: 5,
                level: 'C'
            },
            {
                nombre: 'PEREZ GISELA',
                operacion: 'OP4',
                orden: 6,
                level: 'A'
            },
            {
                nombre: 'SAINTPEE AGUSTIN',
                operacion: 'OP2',
                orden: 7,
                level: 'A'
            },
            {
                nombre: '',
                operacion: '',
                orden: 8,
            },
            {
                nombre: 'VERA ROCIO',
                operacion: 'OP1',
                orden: 9,
                level: 'A'
            },
            {
                nombre: 'CUELAR MARIA',
                operacion: 'OP3',
                orden: 10,
                level: 'C'
            },
        ]
    }
]


const ausentes = [
    'PEDRO PEREZ',
    'JOSE MONTOTO',
    'ESTEBAN RAMIREZ'
]

export default function PanelOpLineaPage() {

    const { response: operaciones, isLoading, getData, getItem, saveItem } = useLineaOperaciones(true, true)
    const { register, control, handleSubmit, formState: { errors }, setFocus, reset, setValue, getValues } = useForm();
    const [active, setActive] = useState(null)

    const fetchItem = async () => {
        const data = await getItem(active.id, true)
        if (!data?.error) {

            setValue("nombre", data?.data?.nombre)
            setValue("habilitado", parseInt(data?.data?.habilitado))
            setValue("nivel", data?.data?.nivel)
        }
    }

    // console.log(operaciones)

    const guardarItem = async () => {

        // console.log(active)
        // return
        const response = await saveItem(active?.id || null, {
            nombre: getValues('nombre'),
            habilitado: getValues('habilitado'),
            nivel: getValues('nivel'),
            orden: active?.orden,
            linea: active?.linea
        })

        setActive(null)
        getData()
    }

    useEffect(() => {
        if (active) {
            if (active?.id) {
                fetchItem()
            }
        } else {
            reset({
                nombre: null,
                habilitado: false
            })
        }
    }, [active])

    return (
        <div className="flex items-start w-full gap-3 ">

            <div className="grid grid-cols-3 gap-3 items-start flex-wrap w-[80%]">
                {operaciones?.filter(l => l.linea != 0).map((l, idx) => (
                    <div key={`l${idx}`} className=' flex flex-col px-2 items-center border border-black pb-2'>
                        <div className='bg-gray-300 border border-black w-full text-center flex items-center justify-between px-2 mt-2 '>
                            <span className='text-xl font-semibold block w-full'>{l.linea}</span>
                        </div>

                        <div className='w-full mt-5'>
                            <div className='flex gap-6 items-start justify-between'>
                                <div className='w-[50%] flex flex-col gap-2 items-start'>
                                    {l?.operaciones?.filter(i => i.orden < 7).map((item, idx) => {
                                        return <OperationLinea
                                            setActive={setActive}
                                            item={{ ...item, linea: l.linea }}
                                            operation={item}
                                            key={idx}
                                        />
                                    })}
                                </div>

                                <div className='w-[50%] flex flex-col gap-2 items-start'>
                                    {l?.operaciones?.filter(i => i.orden > 6).map((item, idx) => {
                                        return <OperationLinea
                                            setActive={setActive}
                                            item={{ ...item, linea: l.linea }}
                                            operation={item}
                                            key={idx}
                                        />
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-[15%] bg-white flex flex-col items-center gap-1 right-10 border border-black p-2 top-20 fixed">

                {active && <span className="font-semibold text-xl block w-full text-center bg-gray-300">{active.linea}</span>}

                <InputUseForm
                    label="Nombre"
                    name="nombre"
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Nombre"
                />

                <SelectUseForm
                    name="nivel"
                    placeholder="Nivel"
                    register={register}
                    className="w-full"
                    size="small"
                    errors={errors}
                    search={true}
                    control={control}
                    options={[
                        { value: '40', label: 'A' },
                        { value: '30', label: 'B' },
                        { value: '20', label: 'C' },
                        { value: '10', label: 'D' },
                        { value: '50', label: 'S' },
                    ]}
                />

                <div className='flex gap-2 items-center w-full'>
                    <div className="text-xs text-start w-[200px]">
                        <input className="p-2 w-4" {...register("habilitado")} type="checkbox" id="habilitado" value="" />
                        <label htmlFor="habilitado" className='text-base'>Habilitado</label>
                    </div>
                </div>


                {isLoading && <Loader />}

                <div className="w-full flex flex-col gap-1">
                    <button
                        disabled={!active || isLoading}
                        onClick={() => {
                            guardarItem()
                        }}
                        className="w-full mt-4 hover:opacity-80 disabled:opacity-50 bg-green-500 text-xs">Guardar</button>

                    <button
                        disabled={!active || isLoading}
                        onClick={() => {
                            setActive(null)
                        }}
                        className="w-full hover:opacity-80 disabled:opacity-50 bg-red-500 text-xs">Cancelar</button>
                </div>

            </div>
        </div >
    )
}
