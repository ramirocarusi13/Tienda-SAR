import { Table } from 'antd'

export default function TableStockLogistica({ data, columns, loading }) {

    return (
        <Table
            bordered
            dataSource={data}
            columns={columns}
            loading={loading}
            rowKey={row => row.id}
            rowClassName={(r, idx) => {
                if (idx % 2 == 0) {
                    return "bg-slate-200 text-2xl"
                }
                return "text-2xl"
            }}
            scroll={{
                x: 2000,
                y: 800
            }}
            pagination={false}
            summary={(pageData) => {
                let totales = [];

                const fechaFin = new Date()
                const mesEnMilisegundos = (1000 * 60 * 60 * 24 * 30)
                const resta = fechaFin.getTime() - (mesEnMilisegundos * 14)
                const fechaInicio = new Date(resta)

                for (let i = fechaInicio; i <= fechaFin; i = new Date(i.getTime() + mesEnMilisegundos)) {
                    totales.push({ ayer: 0, hoy: 0, cantidad: 0, mes: i.getMonth() + 1, ano: i.getFullYear() })
                }

                // console.log(totales)

                pageData.forEach(({ stock, stockAyer, nombre }) => {
                    // console.log(nombre)
                    totales.forEach(t => {

                        const ayer = stockAyer?.filter(s => s.ano == t.ano && s.mes == t.mes)
                        const actual = stock?.filter(s => s.ano == t.ano && s.mes == t.mes)

                        // console.log(nombre, "ACTUAL", stockActual, "ENCONTRADO", actual, t.mes, t.ano)
                        // console.log(nombre, "AYER", stockAyer, "ENCONTRADO", ayer, t.mes, t.ano)

                        let stockC = 0, stockA = 0;
                        if (actual?.length > 0) {
                            stockC = parseInt(actual[0].cantidad)
                        }

                        if (ayer?.length > 0) {
                            stockA = parseInt(ayer[0].cantidad)
                        }


                        t.ayer = t.ayer + stockA
                        t.hoy = t.hoy + stockC

                        if (stockC == 0 && stockA > 0) {
                            t.cantidad = t.cantidad + stockA
                        } else {
                            t.cantidad = t.cantidad + (stockA - stockC)
                        }
                    })
                });

                return (
                    <>
                        <Table.Summary.Row className="">
                            <Table.Summary.Cell index={0}><span className="text-xl font-semibold">EGRESOS</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[0].ayer > totales[0].hoy && 'bg-green-400'}`} index={1}><span className='text-xl font-semibold text-center block'>{totales[0].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[1].ayer > totales[1].hoy && 'bg-green-400'}`} index={2}><span className='text-xl font-semibold text-center block'>{totales[1].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[2].ayer > totales[2].hoy && 'bg-green-400'}`} index={3}><span className='text-xl font-semibold text-center block'>{totales[2].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[3].ayer > totales[3].hoy && 'bg-green-400'}`} index={4}><span className='text-xl font-semibold text-center block'>{totales[3].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[4].ayer > totales[4].hoy && 'bg-green-400'}`} index={5}><span className='text-xl font-semibold text-center block'>{totales[4].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[5].ayer > totales[5].hoy && 'bg-green-400'}`} index={6}><span className='text-xl font-semibold text-center block'>{totales[5].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[6].ayer > totales[6].hoy && 'bg-green-400'}`} index={7}><span className='text-xl font-semibold text-center block'>{totales[6].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[7].ayer > totales[7].hoy && 'bg-green-400'}`} index={8}><span className='text-xl font-semibold text-center block'>{totales[7].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[8].ayer > totales[8].hoy && 'bg-green-400'}`} index={9}><span className='text-xl font-semibold text-center block'>{totales[8].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[9].ayer > totales[9].hoy && 'bg-green-400'}`} index={10}><span className='text-xl font-semibold text-center block'>{totales[9].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[10].ayer > totales[10].hoy && 'bg-green-400'}`} index={11}><span className='text-xl font-semibold text-center block'>{totales[10].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[11].ayer > totales[11].hoy && 'bg-green-400'}`} index={12}><span className='text-xl font-semibold text-center block'>{totales[11].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[12].ayer > totales[12].hoy && 'bg-green-400'}`} index={13}><span className='text-xl font-semibold text-center block'>{totales[12].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[13].ayer > totales[13].hoy && 'bg-green-400'}`} index={14}><span className='text-xl font-semibold text-center block'>{totales[13].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black ${totales[14].ayer > totales[14].hoy && 'bg-green-400'}`} index={15}><span className='text-xl font-semibold text-center block'>{totales[14].cantidad}</span></Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                        </Table.Summary.Row>

                        <Table.Summary.Row className="">
                            <Table.Summary.Cell index={0}><span className="text-xl font-semibold">RESTA</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={1}><span className='text-xl font-semibold text-center block'>{totales[0].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={2}><span className='text-xl font-semibold text-center block'>{totales[1].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={3}><span className='text-xl font-semibold text-center block'>{totales[2].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={4}><span className='text-xl font-semibold text-center block'>{totales[3].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={5}><span className='text-xl font-semibold text-center block'>{totales[4].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={6}><span className='text-xl font-semibold text-center block'>{totales[5].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={7}><span className='text-xl font-semibold text-center block'>{totales[6].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={8}><span className='text-xl font-semibold text-center block'>{totales[7].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={9}><span className='text-xl font-semibold text-center block'>{totales[8].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={10}><span className='text-xl font-semibold text-center block'>{totales[9].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={11}><span className='text-xl font-semibold text-center block'>{totales[10].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={12}><span className='text-xl font-semibold text-center block'>{totales[11].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={13}><span className='text-xl font-semibold text-center block'>{totales[12].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={14}><span className='text-xl font-semibold text-center block'>{totales[13].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell className={`border-2 border-black bg-red-500`} index={15}><span className='text-xl font-semibold text-center block'>{totales[14].hoy}</span></Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                            <Table.Summary.Cell> </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </>
                );
            }
            }
        />
    )
}
