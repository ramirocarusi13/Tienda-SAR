import mainLogo from "@assets/main_logo.jpg";
import { useAuth } from "@hooks/useAuth";
import { ROLES, routesNames } from '@utils/Constants';
import { Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { FaBoxes, FaTruck } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdQrCode2 } from "react-icons/md";
import { PiEqualizerFill } from "react-icons/pi";
import { RxExit } from "react-icons/rx";
import { Link, Outlet } from "react-router-dom";
import { CiWarning } from "react-icons/ci";

const ENVIROMENT = import.meta.env.VITE_API_ENVIROMENT

import {
    AppstoreOutlined,
    DashboardOutlined,
    ImportOutlined,
    InboxOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Modal } from "antd";
import ModalIssues from "../components/ModalIssues";
import { jerarquias } from "../utils/Constants";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const rutasDisponibles = [
    {
        ruta: routesNames.DASHBOARD,
        nombre: 'Dashboard',
        icono: <DashboardOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: []
    },
    {
        nombre: 'Panel operaciones',
        icono: <UserOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: [
            {
                ruta: routesNames.PRODUCTION.PANEL_OPERACIONES,
                nombre: 'Panel',
                icono: <UserOutlined />,
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.PRODUCTION.PANEL_OPERACIONES_LINEA,
                nombre: 'Operaciones Linea',
                icono: <UserOutlined />,
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.PRODUCTION.PANEL_OPERACIONES_LINEA_USER,
                nombre: 'Polivalencias',
                icono: <UserOutlined />,
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
        ]
    },
    {
        nombre: 'Config',
        icono: <UserOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: [
            {
                ruta: routesNames.CONFIG.BUFFER,
                nombre: 'Buffer',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
        ]
    },
    {
        nombre: 'Maestros',
        icono: <UserOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: [
            {
                ruta: routesNames.MODELS.ABM,
                nombre: 'Modelos',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.TABLAS.INDEX,
                nombre: 'Tablas',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.TABLAS.LINEAS,
                nombre: 'Lineas',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            }
        ]
    },
    {
        nombre: 'PC',
        icono: <FaTruck />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: [
            {
                ruta: routesNames.PC.PLAN,
                nombre: 'Plan Semanal',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.PC.REIMPRIMIR,
                nombre: 'Reimprimir Kanbans',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            // {
            //     ruta: routesNames.PC.PENDIENTES_IMPRESION,
            //     nombre: 'Planificación',
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
            //     ],
            // },
            // {
            //     ruta: routesNames.PC.MINIMOS_MODELOS,
            //     nombre: 'Minimos modelo',
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
            //     ],
            // },
            // {
            //     ruta: routesNames.PC.LAYOUT,
            //     nombre: 'Layout',
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
            //     ],
            // },
            // {
            //     ruta: routesNames.PC.DESPACHO,
            //     nombre: 'Carga pedido',
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
            //     ],
            // },
            // {
            //     ruta: routesNames.PC.ALMACENAR,
            //     nombre: 'Almacenar',
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
            //     ],
            // },

        ]
    },
    // {
    //     ruta: routesNames.PC.TRASVASO,
    //     nombre: 'Trasvaso',
    //     icono: <AppstoreOutlined />,
    //     rolesAdmitidos: [
    //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
    //     ],
    //     childrens: []
    // },
    {
        ruta: routesNames.CORTE.PLAN,
        nombre: 'Plan de Corte',
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: []
    },
    {
        ruta: routesNames.CORTE.ACTUALIZAR_TIEMPOS,
        nombre: 'Actualización Dados Tiempos',
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: []
    },
    {
        ruta: routesNames.PRODUCTION.MODIFICAR_TIEMPOS_CORTE,
        nombre: 'Tiempos Corte',
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: []
    },
    {
        ruta: routesNames.PRODUCTION.HORA_HORA,
        nombre: 'Carga Hora Hora',
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: []
    },
    {
        ruta: routesNames.CORTE.GESTION_DADOS,
        nombre: 'Lectra - Gestión',
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: []
    },
    {
        ruta: routesNames.TIENDA.PEDIDO_REPOSICION,
        nombre: 'Pedido reposición',
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: []
    },
    {
        ruta: routesNames.PRODUCTION.BUFFER_CORTE,
        nombre: 'Buffer de corte',
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: []
    },
    // {
    //     nombre: 'Ingresos',
    //     icono: <UserOutlined />,
    //     rolesAdmitidos: [
    //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
    //     ],
    //     childrens: [
    //         {
    //             ruta: routesNames.PRODUCTION.BUFFER_IN,
    //             nombre: 'Ingreso Buffer',
    //             icono: <LoginOutlined />,
    //             rolesAdmitidos: [
    //                 ROLES.DESARROLLO, ROLES.ADMINISTRADOR
    //             ],
    //             childrens: []
    //         },
    //         {
    //             ruta: routesNames.PRODUCTION.SUBASSY_IN,
    //             nombre: 'Ingreso Pre Ensamble',
    //             icono: <LoginOutlined />,
    //             rolesAdmitidos: [
    //                 ROLES.DESARROLLO, ROLES.ADMINISTRADOR
    //             ],
    //             childrens: []
    //         },
    //         {
    //             ruta: routesNames.PRODUCTION.ASSY_IN,
    //             nombre: 'Ingreso Ensamble',
    //             icono: <LoginOutlined />,
    //             rolesAdmitidos: [
    //                 ROLES.DESARROLLO, ROLES.ADMINISTRADOR
    //             ],
    //             childrens: []
    //         },
    //         {
    //             ruta: routesNames.PRODUCTION.CORTE_IN,
    //             nombre: 'Ingreso Corte',
    //             icono: <LoginOutlined />,
    //             rolesAdmitidos: [
    //                 ROLES.DESARROLLO, ROLES.ADMINISTRADOR
    //             ],
    //             childrens: []
    //         },
    //     ]
    // },

    {
        nombre: 'Kanban',
        icono: <MdQrCode2 />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: [
            {
                ruta: routesNames.PRODUCTION.KANBAN_CREATE,
                nombre: 'Crear',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.PRODUCTION.KANBAN_LIST,
                nombre: 'Listado',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.PRODUCTION.KANBAN_PRINT,
                nombre: 'Reimpresión',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
            {
                ruta: routesNames.PRODUCTION.KANBAN_BLOCK,
                nombre: 'Baja',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
        ]
    },
    {
        nombre: 'Tienda',
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: [
            {
                ruta: routesNames.STOCK.TIENDA_STOCK,
                nombre: 'Stock',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.TIENDA.EGRESO,
                nombre: 'Egreso',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            // {
            //     ruta: routesNames.STOCK.TIENDA_EGRESO,
            //     nombre: 'Egreso por kanban',
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
            //     ],
            // },
            {
                ruta: routesNames.STOCK.TIENDA_INGRESO,
                nombre: 'Ingreso por kanban',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.STOCK.TIENDA_INGRESO_MANUAL,
                nombre: 'Movimiento manual',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
        ]
    },
    {
        nombre: 'Stock',
        icono: <InboxOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
        childrens: [
            {
                ruta: routesNames.STOCK.PIEZAS,
                nombre: 'Piezas',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
        ]
    },
    {
        nombre: 'Inventario',
        icono: <InboxOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.INVENTARIO
        ],
        childrens: [
            {
                ruta: routesNames.STOCK.INVENTARIO_MATERIALES,
                nombre: 'Carga Tela',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.INVENTARIO
                ],
            },
            {
                ruta: routesNames.STOCK.INVENTARIO_CUEROS,
                nombre: 'Carga Cueros',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.INVENTARIO
                ],
            },
            {
                ruta: routesNames.STOCK.INVENTARIO_MATERIALES_EDIT,
                nombre: 'Edición',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR
                ],
            },
            {
                ruta: routesNames.STOCK.INVENTARIO_MATERIALES_RESULTADO,
                nombre: 'Resultados Tela',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.INVENTARIO
                ],
            },
            {
                ruta: routesNames.STOCK.INVENTARIO_CUEROS_RESULTADO,
                nombre: 'Resultados Cueros',
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.INVENTARIO
                ],
            },
        ]
    },
    {
        nombre: 'Importar',
        icono: <ImportOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO
        ],
        childrens: [
            {
                ruta: routesNames.IMPORT.PIEZAS,
                nombre: 'Partes',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
            {
                ruta: routesNames.IMPORT.MATERIALES_PIEZAS,
                nombre: 'Materiales piezas',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
            {
                ruta: routesNames.IMPORT.DADOS,
                nombre: 'Dados',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
            {
                ruta: routesNames.IMPORT.MATERIALES_PIEZAS_PROV,
                nombre: 'Materiales piezas y prov',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
            {
                ruta: routesNames.IMPORT.DATOS_CORTE,
                nombre: 'Datos corte',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
            {
                ruta: routesNames.IMPORT.FALLAS,
                nombre: 'Fallas',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
            {
                ruta: routesNames.IMPORT.TIENDA,
                nombre: 'Tienda',
                rolesAdmitidos: [
                    ROLES.DESARROLLO
                ],
            },
        ]
    },
    // {
    //     ruta: routesNames.PRODUCTION.LECTRAS,
    //     nombre: 'Lectras',
    //     icono: <DesktopOutlined />,
    //     rolesAdmitidos: [
    //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
    //     ],
    //     childrens: []
    // },
    // {
    //     ruta: routesNames.CORTE.INDEX,
    //     nombre: 'Corte',
    //     icono: <DesktopOutlined />,
    //     rolesAdmitidos: [
    //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR
    //     ],
    //     childrens: []
    // },
    // {
    //     ruta: routesNames.LOGISTICA.STOCK_DISPONIBLE,
    //     nombre: 'Logistica - Stock',
    //     icono: <FaBoxes />,
    //     rolesAdmitidos: [
    //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.LOGISTICA
    //     ],
    //     childrens: []
    // },
    // {
    //     ruta: routesNames.LOGISTICA.REPORTE_RUNS_KANBAN,
    //     nombre: 'Reporte Runs',
    //     icono: <FaBoxes />,
    //     rolesAdmitidos: [
    //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.LOGISTICA, ROLES.CALIDAD
    //     ],
    //     childrens: []
    // },
    {
        ruta: routesNames.PRODUCTION.CONTRAMEDIDA,
        nombre: 'Contramedida',
        icono: <PiEqualizerFill />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD
        ],
        childrens: []
    },
    // {
    //     ruta: routesNames.CALIDAD.REPORTE_TRAZA_AIRBAG,
    //     nombre: 'Reporte trazabilidad',
    //     icono: <PiEqualizerFill />,
    //     rolesAdmitidos: [
    //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD
    //     ],
    //     childrens: []
    // },
    {
        ruta: routesNames.CALIDAD.CONTROL_STRAP,
        nombre: 'Control Strap',
        icono: <PiEqualizerFill />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD, ROLES.STRAP
        ],
        childrens: []
    },
    {
        ruta: routesNames.CALIDAD.REGISTRO_EGRESO_STRAP,
        nombre: 'Registro entrega Strap',
        icono: <HiOutlineDocumentReport />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD, ROLES.STRAP
        ],
        childrens: []
    },
    {
        nombre: 'Calidad',
        icono: <ImportOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO
        ],
        childrens: [
            // {
            //     ruta: routesNames.CALIDAD.CUARENTENA,
            //     nombre: 'Cuarentena',
            //     icono: <PiEqualizerFill />,
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD
            //     ],
            //     childrens: []
            // },
            {
                ruta: routesNames.CALIDAD.REPORTE_INTERNO_DEFECTOS,
                nombre: 'Reporte interno defectos',
                icono: <PiEqualizerFill />,
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD
                ],
                childrens: []
            },
            {
                ruta: routesNames.CALIDAD.ANALISIS_DEFECTO,
                nombre: 'Reporte interno defectos',
                icono: <PiEqualizerFill />,
                rolesAdmitidos: [
                    ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD
                ],
                childrens: []
            }
            // {
            //     ruta: routesNames.CALIDAD.FIN_DE_LINEA,
            //     nombre: 'EOL',
            //     icono: <PiEqualizerFill />,
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD
            //     ],
            //     childrens: []
            // },
            // {
            //     ruta: routesNames.CALIDAD.CONTROL_STRAP,
            //     nombre: 'Control Strap',
            //     icono: <PiEqualizerFill />,
            //     rolesAdmitidos: [
            //         ROLES.DESARROLLO, ROLES.ADMINISTRADOR, ROLES.CALIDAD
            //     ],
            //     childrens: []
            // },
        ]
    }
]

export default function TemplateDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const { userData, logout } = useAuth()

    const getItemsByRol = () => {
        const lItems = []
        let childs = []
        let existeAlMenosUno = false

        rutasDisponibles.map((ruta, idx) => {
            const existe = userData?.menu?.find(m => m.ruta == ruta.ruta)
            if (existe || !ruta?.ruta) {
                // if (existe) {
                if (ruta.childrens?.length > 0) {
                    ruta.childrens.map((child, id) => {
                        const existeChild = userData?.menu?.find(m => m.ruta == child.ruta)
                        if (existeChild) {
                            existeAlMenosUno = true
                            childs.push(getItem(<Link className="text-sm font-normal" to={child.ruta}>{child.nombre}</Link>, `k${idx}${id}`))
                        }
                    })

                    if (existeAlMenosUno) {
                        lItems.push(getItem(ruta.nombre, idx, ruta.icono, childs))
                    }

                    existeAlMenosUno = false
                    childs = []
                } else {
                    lItems.push(getItem(<Link className="text-sm font-normal" to={ruta.ruta}>{ruta.nombre}</Link>, idx, ruta.icono))
                }
            }
        })

        // rutasDisponibles.map((ruta, idx) => {
        //     if (ruta.rolesAdmitidos.includes(userData?.rol?.id)) {
        //         if (ruta.childrens?.length > 0) {
        //             ruta.childrens.map((child, id) => {
        //                 if (child.rolesAdmitidos.includes(userData?.rol?.id)) {
        //                     childs.push(getItem(<Link className="text-sm font-normal" to={child.ruta}>{child.nombre}</Link>, `k${idx}${id}`))
        //                 }
        //             })

        //             lItems.push(getItem(ruta.nombre, idx, ruta.icono, childs))
        //             childs = []
        //         } else {
        //             lItems.push(getItem(<Link className="text-sm font-normal" to={ruta.ruta}>{ruta.nombre}</Link>, idx, ruta.icono))
        //         }
        //     }
        // })

        return lItems
    }

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                {/* <Sider width={userData?.rol?.id == ROLES.LOGISTICA || userData?.rol?.id == ROLES.CALIDAD ? 0 : 250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}> */}
                <div className="max-h-[80px] bg-white " >
                    <Link to={routesNames.DASHBOARD}>
                        <img src={mainLogo} className='w-[70%] h-full object-cover m-auto' />
                    </Link>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={getItemsByRol()} />
            </Sider>

            <Layout className="bg-[#f4f6f8]">
                <Header
                    style={{
                        padding: 0,
                        height: 58,
                        background: `${(ENVIROMENT == 'TEST' || ENVIROMENT == 'STAGING') ? 'rgb(34 197 94)' : "#277c9c"}`,
                    }}
                >
                    <div className='flex px-4 justify-between items-center h-full'>
                        <ModalIssues isVisible={isVisibleModal} setIsVisible={setIsVisibleModal} />
                        {/* <span onClick={() => setIsVisibleModal(true)} className='hover:opacity-80 hover:cursor-pointer font-semibold flex items-center justyi gap-2 rounded-md text-black text-xs bg-orange-400 px-3 py-2'> <CiWarning className="text-xl" /> INFORMAR DE UN PROBLEMA </span> */}
                        <div></div>
                        <div className='flex items-center gap-2'>

                            {userData?.rol == jerarquias.DEV &&
                                <Link className="mr-2 text-white underline hover:!text-blue-500" to={routesNames.CONFIGURATION}>Autorización de tareas</Link>
                            }

                            {ENVIROMENT == 'TEST' && <span className={`font-semibold text-xs mr-4  bg-yellow-200 p-2 rounded-xl`}>Entorno TEST</span>}
                            {ENVIROMENT == 'STAGING' && <span className={`font-semibold text-xs mr-4  bg-yellow-200 p-2 rounded-xl`}>ENTORNO DE PRUEBAS</span>}
                            {ENVIROMENT == 'PRODUCCIÓN' && <span className={`font-bold text-xs mr-4  bg-yellow-100 p-2 rounded-xl`}>v1.0</span>}

                            <span className='font-semibold rounded-md text-black text-xs bg-[#f4f6f8] px-3 py-2'> Bienvenido {userData?.email?.toUpperCase()} </span>
                            <Link onClick={() => logout()} className=' rounded-lg text-white text-3xl hover:opacity-80 hover:!text-red-500'><RxExit /></Link>
                        </div>
                    </div>
                </Header>

                <Content
                    style={{
                        overflowX: 'scroll'
                    }}
                >

                    <div
                        style={{
                            padding: 10,
                            minHeight: 360,

                        }}
                        className="bg-white rounded-lg m-2 border !min-h-[90vh] overflow-y-scroll border-gray-300"
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}