import { Table } from 'antd';
import React from 'react'

export default function TableInventario({ data, columns, loading }) {
    return (
        <Table
            bordered={true}
            size="small"
            locale={{
                emptyText: "No se encontraron registros",
            }}
            // rowClassName={(row) => {
            //     if (row.orden % 2 == 0) {
            //         return "bg-slate-200"
            //     }
            // }}
            className="w-full overflow-x-scroll"

            pagination={false}
            columns={columns}
            loading={loading}
            dataSource={data}
            rowKey={(item) => item.id}

        // summary={(pageData) => {
        //     let totalKg = 0;
        //     let totalM2 = 0;
        //     let totalMl = 0;

        //     pageData.forEach(({ inventario_sum_cantidad, ancho, densidad }) => {
        //         totalKg = totalKg + parseFloat(inventario_sum_cantidad || 0)
        //         let m2 = 0
        //         let ml = 0;

        //         if (parseFloat(densidad) > 0 && parseFloat(inventario_sum_cantidad) >= 0) {
        //             m2 = (parseFloat(inventario_sum_cantidad) / parseFloat(densidad)).toFixed(3)
        //         }

        //         totalM2 = parseFloat(totalM2) + parseFloat(m2)


        //         if (m2 > 0) {
        //             // console.log(m2, totalM2)
        //             if (parseFloat(ancho) > 0) {
        //                 ml = (m2 / parseFloat(ancho)).toFixed(2)
        //             }
        //         }

        //         totalMl = parseFloat(totalMl) + parseFloat(ml)
        //     });
        //     return (
        //         <>
        //             <Table.Summary.Row className="">
        //                 <Table.Summary.Cell index={0}></Table.Summary.Cell>
        //                 <Table.Summary.Cell index={1}><span className=" font-bold">TOTALES</span></Table.Summary.Cell>
        //                 <Table.Summary.Cell index={2}></Table.Summary.Cell>
        //                 <Table.Summary.Cell index={3}></Table.Summary.Cell>
        //                 <Table.Summary.Cell align="right" index={4}><span className=" font-bold">KG {totalKg.toFixed(3)}</span></Table.Summary.Cell>
        //                 <Table.Summary.Cell index={3}></Table.Summary.Cell>
        //                 <Table.Summary.Cell align="right" index={4}><span className=" font-bold">M2 {parseFloat(totalM2).toFixed(3)}</span></Table.Summary.Cell>
        //                 <Table.Summary.Cell index={3}></Table.Summary.Cell>
        //                 <Table.Summary.Cell align="right" index={4}><span className=" font-bold">ML {parseFloat(totalMl).toFixed(3)}</span></Table.Summary.Cell>

        //             </Table.Summary.Row>

        //         </>
        //     );
        // }}
        />
    )
}
