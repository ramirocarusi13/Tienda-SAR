<?php

namespace App\Services;

use App\Http\Depositos;
use App\Http\StockPiezasLib;
use App\Models\Piezas;
use App\Models\TiendaPedido;
use App\Models\TiendaPedidoItems;
use App\Models\VTPiezas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TiendaService {

    public int $pedidoId;


    public function crearPedido(int $userId, int $fallaId, int|null $lineaId) {

        $pedido = TiendaPedido::create([
            'user_id'   => $userId,
            'falla_id'  => $fallaId,
            'linea_id'  => $lineaId
        ]);

        if ($pedido) {
            $this->pedidoId = $pedido->id;
        }
    }

    private function obtenerQrPieza(int $piezaId): string {

        $pieza = VTPiezas::where('id', $piezaId)->first();

        if (!$pieza) {
            return '';
        }

        $qr = $pieza->modelo . "]" . $pieza->codigo . "]" . $pieza->lado; //'MODELO|COD|LADO';

        return $qr;
    }

    public function agregaPieza(int $piezaId, int $cantidad = 1) {

        $qr = $this->obtenerQrPieza($piezaId);

        TiendaPedidoItems::create([
            'pedido_id' => $this->pedidoId,
            'pieza_id'  => $piezaId,
            'cantidad'  => $cantidad,
            'qr'        => $qr
        ]);
    }

    public function agregaPiezas(array $piezas, int $cantidad = 1) {

        foreach ($piezas as $pieza) {
            $this->agregaPieza($pieza['id'], $cantidad);
            // TiendaPedidoItems::create([
            //     'pedido_id' => $this->pedidoId,
            //     'pieza_id'  => $pieza['id'],
            //     'cantidad'  => $cantidad
            // ]);
        }
    }

    static function getPedidosPendientes() {
        $pedidos = TiendaPedido::with('linea', 'falla', 'user', 'items.pieza.parte.modelo', 'items.pieza.material_pieza')
            ->where('pendiente', 1)
            ->orderByDesc('created_at')
            ->get();

        return $pedidos;
    }

    static function getPedidosEntrantes(): array {
        $pedidos = DB::table('tienda_pedidos')
            ->leftJoin('lineas', 'lineas.id', '=', 'tienda_pedidos.linea_id')
            ->leftJoin('codigo_fallas', 'codigo_fallas.id', '=', 'tienda_pedidos.falla_id')
            ->leftJoin('users', 'users.id', '=', 'tienda_pedidos.user_id')
            ->where('tienda_pedidos.pendiente', 1)
            ->orderByDesc('tienda_pedidos.created_at')
            ->limit(50)
            ->get([
                'tienda_pedidos.id',
                'tienda_pedidos.user_id',
                'tienda_pedidos.falla_id',
                'tienda_pedidos.kanban_id',
                'tienda_pedidos.linea_id',
                'tienda_pedidos.created_at',
                'lineas.codigo as linea_codigo',
                'lineas.nombre as linea_nombre',
                'codigo_fallas.nombre as falla_nombre',
                'codigo_fallas.codigo as falla_codigo',
                'users.email as user_email',
            ]);

        $pedidoIds = $pedidos->pluck('id')->values();

        if ($pedidoIds->isEmpty()) {
            return [];
        }

        $items = DB::table('tienda_pedido_items')
            ->leftJoin('piezas', 'piezas.id', '=', 'tienda_pedido_items.pieza_id')
            ->leftJoin('partes', 'partes.id', '=', 'piezas.parte_id')
            ->leftJoin('modelos', 'modelos.id', '=', 'partes.modelo_id')
            ->leftJoin('materiales_piezas', 'materiales_piezas.id', '=', 'piezas.material_pieza_id')
            ->whereIn('tienda_pedido_items.pedido_id', $pedidoIds)
            ->orderBy('tienda_pedido_items.id')
            ->get([
                'tienda_pedido_items.id',
                'tienda_pedido_items.pedido_id',
                'tienda_pedido_items.pieza_id',
                'tienda_pedido_items.cantidad',
                'tienda_pedido_items.qr',
                'piezas.codigo as pieza_codigo',
                'materiales_piezas.nombre as material_nombre',
                'modelos.nombre as modelo_nombre',
            ])
            ->groupBy('pedido_id');

        return $pedidos->map(function ($pedido) use ($items) {
            $pedidoItems = ($items[$pedido->id] ?? collect())->map(function ($item) {
                return [
                    'id'       => $item->id,
                    'pedido_id' => $item->pedido_id,
                    'pieza_id'  => $item->pieza_id,
                    'cantidad'  => $item->cantidad,
                    'qr'        => $item->qr,
                    'pieza'     => [
                        'id'             => $item->pieza_id,
                        'codigo'         => $item->pieza_codigo,
                        'material_pieza' => [
                            'nombre' => $item->material_nombre,
                        ],
                        'parte'          => [
                            'modelo' => [
                                [
                                    'nombre' => $item->modelo_nombre,
                                ],
                            ],
                        ],
                    ],
                ];
            })->values()->toArray();

            return [
                'id'         => $pedido->id,
                'user_id'    => $pedido->user_id,
                'falla_id'   => $pedido->falla_id,
                'kanban_id'  => $pedido->kanban_id,
                'linea_id'   => $pedido->linea_id,
                'created_at' => $pedido->created_at,
                'linea'      => [
                    'codigo' => $pedido->linea_codigo,
                    'nombre' => $pedido->linea_nombre,
                ],
                'falla'      => [
                    'codigo' => $pedido->falla_codigo,
                    'nombre' => $pedido->falla_nombre,
                ],
                'user'       => [
                    'email' => $pedido->user_email,
                ],
                'items'      => $pedidoItems,
            ];
        })->toArray();
    }

    public function finalizarPedido(Request $request) {

        $this->generaSalidaPiezasStock($request->id);

        TiendaPedido::where('id', $request->id)
            ->update([
                'pendiente'             => 0,
                'user_autorizante_id'   => auth()->guard('api')->user()->id
            ]);
    }

    private function generaSalidaPiezasStock($pedidoId) {
        $items = TiendaPedidoItems::where('pedido_id', $pedidoId)->get();
        $piezasEgresadas = [];

        foreach ($items as $item) {
            StockPiezasLib::generarMovimiento($item->pieza_id, $item->cantidad * -1, null, Depositos::TIENDA, "PEDIDO #" . $pedidoId, auth()->guard('api')->user()->id, false);
            $piezasEgresadas[] = $item->pieza_id;
        }

        StockPiezasLib::controlaPuntoOptimoPiezasEgresadasTienda($piezasEgresadas);
    }
}
