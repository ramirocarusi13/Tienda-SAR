
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ChartTiemposMuertos({ dataSource, title = '' }) {

    return <Stack width="80%" >
        {/* <Typography variant="h6" component="span" textAlign="center">
                Top Defectos Turno Actual
            </Typography> */}
        <BarChart
            localeText={{
                noData: "No hay tiempos muertos registrados"
            }}

            height={200}
            series={[
                {
                    data: dataSource?.map(d => parseInt(d?.cantidad)) || [], id: 'pvId'
                },
            ]}
            barLabel="value"
            yAxis={[{ width: 30 }]}
            xAxis={[
                {
                    id: 'bartopModelos',
                    data: dataSource?.map(f => f.nombre?.toUpperCase()),
                    colorMap: {
                        type: 'piecewise',
                        thresholds: [],
                        colors: ['#FFAA00']
                    }
                },
            ]}
        />
    </Stack >
}
