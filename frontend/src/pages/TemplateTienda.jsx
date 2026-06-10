import mainLogo from "@assets/main_logo.jpg";
import { useAuth } from "@hooks/useAuth";
import { ROLES, routesNames } from '@utils/Constants';
import { Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { RxExit } from "react-icons/rx";
import { Link, Outlet } from "react-router-dom";
import { AiOutlineStock } from "react-icons/ai";
import { CiInboxOut } from "react-icons/ci";
import { CiInboxIn } from "react-icons/ci";

const ENVIROMENT = import.meta.env.VITE_API_ENVIROMENT

import {
    AppstoreOutlined,
    ImportOutlined,
    PrinterOutlined
} from '@ant-design/icons';
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
        ruta: routesNames.STOCK.TIENDA_STOCK,
        nombre: 'Stock',
        icono: <AiOutlineStock />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
    },
    {
        ruta: routesNames.TIENDA.EGRESO,
        nombre: 'Egreso',
        icono: <CiInboxOut />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
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
        icono: <AppstoreOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
    },
    {
        ruta: routesNames.STOCK.TIENDA_INGRESO_MANUAL,
        nombre: 'Ingreso manual',
        icono: <CiInboxIn />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
    },
    {
        ruta: routesNames.TIENDA.IMPRESION_ETQ,
        nombre: 'Etiquetas',
        icono: <PrinterOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
    },
    {
        ruta: routesNames.IMPORT.TIENDA,
        nombre: 'Importar layout',
        icono: <ImportOutlined />,
        rolesAdmitidos: [
            ROLES.DESARROLLO, ROLES.ADMINISTRADOR
        ],
    },

]

export default function TemplateTienda() {
    const [collapsed, setCollapsed] = useState(false);
    const { userData, logout } = useAuth()

    const getItemsByRol = () => {
        const lItems = []
        let childs = []
        let existeAlMenosUno = false

        rutasDisponibles.map((ruta, idx) => {
            if (ruta?.ruta) {
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
                    <Link to={routesNames.STOCK.TIENDA_STOCK}>
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
                        <span className='font-semibold rounded-md text-black text-xs bg-[#f4f6f8] px-3 py-2'>Tienda</span>
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
