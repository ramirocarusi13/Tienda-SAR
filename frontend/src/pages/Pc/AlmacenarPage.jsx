import { Tabs } from 'antd';
import Almacenar from "../../components/Stock/Almacenar";
import ReporteStockPage from "./Stock/ReporteStockPage";
import TransferEntreDepositos from "./TransferEntreDepositos";
import { RACK_LETTERS, RACK_LEVELS, RACK_ROW_NUMBERS } from '@utils/positionFormat';

const pos = RACK_LETTERS
const subPos = RACK_ROW_NUMBERS.map((row) => String(row))
const levels = RACK_LEVELS.map((level) => String(level))
let orden = 0;
let str = '';

const armarPosiciones = () => {
    pos.forEach(p => {
        subPos.forEach(s => {
            levels.forEach(l => {
                orden++
                str = str + ` INSERT INTO ubicaciones (deposito_id,orden,capacidad,nombre) values (8,${orden},1,'${p}-${s}-${l}')`
                // console.log(`INSERT INTO ubicaciones (deposito_id,orden,capacidad,nombre) values (8,${orden},1,'${p}-${s}-${l}')`)
            })
        })
    })

    console.log(str)
}

export default function AlmacenarPage() {


    // useEffect(() => {
    //     armarPosiciones()
    // }, [])



    return (
        <Tabs
            items={[
                {
                    key: '1',
                    label: 'Reporte',
                    children: <ReporteStockPage />
                },
                {
                    key: '2',
                    label: 'Almacenar',
                    children: <Almacenar />
                },
                {
                    key: '3',
                    label: 'Transferir',
                    children: <TransferEntreDepositos />
                },

            ]}

        />
    )
}
