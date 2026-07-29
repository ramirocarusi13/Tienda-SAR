<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ['cors', 'json.response']], function () {
    Route::post('/login', [\App\Http\Controllers\Auth\ApiAuthController::class, 'login'])->name('login');

    // Pantalla publica de pedido de reposicion.
    Route::post('auth/validar_usuario', [\App\Http\Controllers\UsersControllers::class, 'userValidoByCodAutorizacion']);
    Route::get('fallastienda', [\App\Http\Controllers\TiendaController::class, 'getFallasTienda']);
    Route::get('linea/{linea}/modelos', [\App\Http\Controllers\LineasController::class, 'getModelosLinea']);
    Route::get('tienda/info/{codigoKanban}', [\App\Http\Controllers\TiendaController::class, 'getInfoModelByKanban']);
    Route::post('tienda/pedido', [\App\Http\Controllers\TiendaController::class, 'setPedido']);
    Route::get('tienda/pedidos/entrantes', [\App\Http\Controllers\TiendaController::class, 'getPedidosEntrantes']);
    Route::post('retrabajo', [\App\Http\Controllers\FallasInformadasController::class, 'cambiarEstadoRetrabajo']);

    // PDF de kanban de reposicion usado desde la grilla de stock.
    Route::get('pieza/getFileReposicion/{piezaId}/{modelo}/{file}/{capas}', [\App\Http\Controllers\StockPiezasController::class, 'getFileKanbanReposicion']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'json.response']], function () {
    // Datos auxiliares que consumen las pantallas de tienda.
    Route::get('modelos', [\App\Http\Controllers\ModelosController::class, 'index']);
    Route::get('modelos/{modelo}', [\App\Http\Controllers\ModelosController::class, 'show']);
    Route::get('partes/{parteId}/piezas', [\App\Http\Controllers\PiezasController::class, 'getPiezasByParte']);
    Route::get('piezas', [\App\Http\Controllers\PiezasController::class, 'index']);
    Route::get('piezas/{pieza}', [\App\Http\Controllers\PiezasController::class, 'show']);
    Route::put('piezas/{pieza}', [\App\Http\Controllers\PiezasController::class, 'update']);
    Route::post('piezas/{pieza}', [\App\Http\Controllers\PiezasController::class, 'update']);
    Route::get('materiales_piezas/{tipoMaterial?}', [\App\Http\Controllers\MaterialesPiezasController::class, 'getMaterialesPiezasPorTipo']);
    Route::get('kanban/{kanbanCode}/piezas/{esEgreso}', [\App\Http\Controllers\PiezasController::class, 'getPiezasBykanbanWithStockTienda']);

    // Importacion de layout de tienda.
    Route::post('import/tiendalayout', [\App\Http\Controllers\ImportController::class, 'importTiendaLayout']);

    // Tienda.
    Route::get('tienda/pedidos', [\App\Http\Controllers\TiendaController::class, 'getPedidosPendientes']);
    Route::get('tienda/egreso_pedido/{pedidoId}', [\App\Http\Controllers\TiendaController::class, 'egresoStockTiendaPedido']);
    Route::post('tienda/egreso', [\App\Http\Controllers\StockPiezasController::class, 'egresoStockTienda']);
    Route::post('tienda/ingreso', [\App\Http\Controllers\StockPiezasController::class, 'ingresoStockTienda']);
    Route::get('tienda/reposicion', [\App\Http\Controllers\StockPiezasController::class, 'getStockAReponerTienda']);
    Route::get('tienda/verificarPiezasReemplazoTienda', [\App\Http\StockPiezasLib::class, 'verificarPiezasReemplazoTienda']);
    Route::get('tienda/etiquetas', [\App\Http\Controllers\TiendaController::class, 'getEtiquetas']);
    Route::post('tienda/pedido/finalizar', [\App\Http\Controllers\TiendaController::class, 'finalizarPedido']);
    Route::get('tienda/pedido/{kanbanCode}', [\App\Http\Controllers\TiendaController::class, 'getPedidoByKanban']);
    Route::post('stock/piezasTienda', [\App\Http\Controllers\StockPiezasController::class, 'stockTiendaTodasPiezas']);
});
