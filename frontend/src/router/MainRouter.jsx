import LoginPage from '@pages/LoginPage';
import ImportTiendaPage from '@pages/Import/ImportTiendaPage';
import TiendaIngresoManualPage from '@pages/Stock/TiendaIngresoManualPage';
import TiendaMovimientoPage from '@pages/Stock/TiendaMovimientoPage';
import TiendaStockPage from '@pages/Stock/TiendaStockPage';
import EgresoPorKanbanPage from '@pages/Tienda/EgresoPorKanbanPage';
import ImpresionEtiquetasPage from '@pages/Tienda/ImpresionEtiquetasPage';
import PedidoReposicionPage from '@pages/Tienda/PedidoReposicionPage';
import PedidosEntrantesPage from '@pages/Tienda/PedidosEntrantesPage';
import TemplateTienda from '@pages/TemplateTienda';
import { routesNames } from '@utils/Constants';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const data = localStorage.getItem('@user:key');
    const userData = data ? JSON.parse(data) : null;
    const location = useLocation();

    if (!userData?.isLogged) {
        return <Navigate state={{ from: location }} to={routesNames.LOGIN} replace />;
    }

    return <Outlet />;
};

const RedirectToTiendaRoute = () => {
    const data = localStorage.getItem('@user:key');
    const userData = data ? JSON.parse(data) : null;

    if (userData?.isLogged) {
        return <Navigate to={routesNames.STOCK.TIENDA_STOCK} replace />;
    }

    return <Outlet />;
};

export default function MainRouter() {
    return (
        <Routes>
            <Route element={<RedirectToTiendaRoute />}>
                <Route index path={routesNames.LOGIN} element={<LoginPage />} />
            </Route>

            <Route path={routesNames.TIENDA.PEDIDO_REPOSICION} element={<PedidoReposicionPage />} />
            <Route path={routesNames.TIENDA.PEDIDOS_ENTRANTES} element={<PedidosEntrantesPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<TemplateTienda />}>
                    <Route index element={<Navigate to={routesNames.STOCK.TIENDA_STOCK} replace />} />
                    <Route path={routesNames.DASHBOARD} element={<Navigate to={routesNames.STOCK.TIENDA_STOCK} replace />} />
                    <Route path={routesNames.STOCK.TIENDA_STOCK} element={<TiendaStockPage />} />
                    <Route path={routesNames.TIENDA.EGRESO} element={<EgresoPorKanbanPage />} />
                    <Route path={routesNames.TIENDA.IMPRESION_ETQ} element={<ImpresionEtiquetasPage />} />
                    <Route path={routesNames.STOCK.TIENDA_EGRESO} element={<TiendaMovimientoPage esEgreso={true} />} />
                    <Route path={routesNames.STOCK.TIENDA_INGRESO} element={<TiendaMovimientoPage />} />
                    <Route path={routesNames.STOCK.TIENDA_INGRESO_MANUAL} element={<TiendaIngresoManualPage />} />
                    <Route path={routesNames.IMPORT.TIENDA} element={<ImportTiendaPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to={routesNames.STOCK.TIENDA_STOCK} replace />} />
        </Routes>
    );
}
