<?php

namespace App\Http\Controllers;

use App\Http\Estados;
use App\Http\StockPiezasLib;
use App\Models\EstadoKanban;
use App\Models\KanbansReemplazo;
use App\Models\Lineas;
use App\Models\Modelos;
use App\Models\ModeloSublineTiempo;
use App\Models\PlanCostura;
use App\Models\Piezas;
use App\Models\TiendaPedidoItems;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use stdClass;


class LineasController extends Controller {

    private $CANTIDAD_DEFECTO_LINEAS  = [
        'M1'        => 180,
        'M2'        => 170,
        'M3'        => 125,
        'M4'        => 120,
        'M5'        => 75,
        'M6'        => 72,
        'M7'        => 0,
        'M8'        => 0,
        'M9'        => 0,
        'M10'       => 0,
        'M11'       => 140,
    ];

    public function index() {
        $data = Lineas::get()->toArray();
        return $this->setResponse($data);
    }

    public function lineasOcupacion() {
        $response = [];
        $data = Lineas::with(['kanbansEnBuffer.kanban.modelo'])
            ->whereIn('id', [1, 2, 3, 4, 5, 6, 11])
            ->get()
            ->toArray();

        $fechaActual = date('d/m/Y');

        try {
            foreach ($data as $d) {
                $linea = [];
                $linea['minutos_ocupacion'] = 0;
                $linea['codigo'] = $d['codigo'];
                $linea['id'] = $d['id'];

                $plan = PlanCostura::selectRaw('sum(tm) as cantidad')->where('linea', $d['codigo'])->where('fecha', $fechaActual)->first();

                try {
                    $cantidadPlan = intval($plan->cantidad);
                    $linea['plan_costura'] = $cantidadPlan;
                } catch (\Throwable $th) {
                    $linea['plan_costura'] = 0;
                }

                $total = 0;
                $modelos = [];

                if (is_null($d['kanbans_en_buffer'])) {
                    $kanbansEnBuffer = [];
                } else {
                    $kanbansEnBuffer = $d['kanbans_en_buffer'];
                }

                foreach ($kanbansEnBuffer as $k) {

                    $mod = $k['kanban']['modelo']['nombre'];
                    $cantidad = intval($k['kanban']['modelo']['cantidad']);
                    $minimo = intval($k['kanban']['modelo']['minimo_buffer']);
                    $ptoPedido = intval($k['kanban']['modelo']['ptopedido_buffer']);

                    $pos = $this->existeEnArray($mod, $modelos);

                    if ($pos >= 0) {
                        $modelos[$pos]['cantidad'] = intval($modelos[$pos]['cantidad']) + intval($cantidad);
                    } else {
                        array_push($modelos, [
                            'nombre'    => $mod,
                            'cantidad'  => $cantidad,
                            'minimo'    => $minimo,
                            'ptopedido' => $ptoPedido,
                        ]);
                    }

                    $total +=  intval($cantidad);
                }
                $linea['modelos'] = $modelos;
                $linea['total'] = $total;

                //TOMO DE ACUERDO AL PLAN, SI NO, TOMO VALORES POR DEFECTO PARA QUE NO QUEDE EN 0
                $requerido = intval($linea['plan_costura']);
                if ($requerido == 0) {
                    $requerido = $this->CANTIDAD_DEFECTO_LINEAS[$d['codigo']];
                }

                if ($total < $requerido) {
                    $linea['bgColor'] = '!bg-red-500';
                    $linea['turnos_cubiertos'] = 0;
                } else if ($total <= ($requerido + 20)) {
                    $linea['turnos_cubiertos'] = 1;
                    $linea['bgColor'] = '!bg-yellow-300';
                } else {
                    $linea['turnos_cubiertos'] = 2;
                    $linea['bgColor'] = '!bg-green-500';
                }

                $linea['requerido'] = $requerido;

                array_push($response, $linea);
            }
        } catch (\Throwable $th) {
            Log::error("LineasController::lineasOcupacion : " . $th->getMessage());
        }

        return $this->setResponse($response);
    }

    public function getModelosLinea($linea) {

        $modelos = Modelos::with([
            'fallas.tipo',
            'fallas.lado',
            'partes.lado',
            'partes.tipo',
            'partes.piezas' => function ($q) {
                $q->with(['material_pieza'])->withSum('stockTienda', 'cantidad');
            },
        ])
            ->where('activo', 1)
            ->whereHas('lineas', function ($q) use ($linea) {
                $q->where('linea_id', intval($linea));
            })
            ->get();

        $this->hidratarEstadoTiendaModelos($modelos);

        return $this->setResponse($modelos ? $modelos->toArray() : []);
    }

    public function getModelosLineaFlex() {

        $modelos = Modelos::with([
            'lineas',
            'fallas.tipo',
            'fallas.lado',
            'partes.lado',
            'partes.tipo',
            'partes.piezas' => function ($q) {
                $q->with(['material_pieza'])->withSum('stockTienda', 'cantidad');
            },
        ])
            ->where('activo', 1)
            ->get();

        $this->hidratarEstadoTiendaModelos($modelos);

        return $this->setResponse($modelos ? $modelos->toArray() : []);
    }

    private function hidratarEstadoTiendaModelos($modelos): void {
        $piezas = collect();

        $modelos->each(function ($modelo) use ($piezas) {
            $modelo->partes->each(function ($parte) use ($piezas) {
                $parte->piezas->each(function ($pieza) use ($piezas) {
                    $piezas->push($pieza);
                });
            });
        });

        $piezaIds = $piezas->pluck('id')->filter()->unique()->values();

        if ($piezaIds->isEmpty()) {
            return;
        }

        $pendientes = TiendaPedidoItems::join('tienda_pedidos', 'tienda_pedidos.id', '=', 'tienda_pedido_items.pedido_id')
            ->whereIn('tienda_pedido_items.pieza_id', $piezaIds)
            ->where('tienda_pedidos.pendiente', true)
            ->groupBy('tienda_pedido_items.pieza_id')
            ->selectRaw('tienda_pedido_items.pieza_id, SUM(tienda_pedido_items.cantidad) as cantidad')
            ->pluck('cantidad', 'pieza_id');

        $enCorte = KanbansReemplazo::whereIn('pieza_id', $piezaIds)
            ->whereNull('fecha_ingreso')
            ->pluck('pieza_id')
            ->flip();

        $piezas->each(function (Piezas $pieza) use ($pendientes, $enCorte) {
            $stockActual = intval($pieza->stock_tienda_sum_cantidad ?? 0);
            $pendiente = intval($pendientes[$pieza->id] ?? 0);
            $stockProyectado = $stockActual - $pendiente;
            $minimo = intval($pieza->minimo ?? 0);
            $maximo = intval($pieza->maximo ?? 0);
            $ptoOptimo = intval($pieza->pto_optimo ?? 0);
            $reponer = max(0, $maximo - $stockProyectado);
            $capas = $ptoOptimo > 0 ? intval(ceil($reponer / $ptoOptimo)) : 0;
            $piezaEnCorte = $enCorte->has($pieza->id);
            $debeReponer = !$piezaEnCorte && $minimo > 0 && $stockProyectado <= $minimo && $reponer > 0;

            if ($piezaEnCorte) {
                $estado = 'EN_CORTE';
            } else if ($debeReponer) {
                $estado = 'PUNTO_PEDIDO';
            } else if ($maximo > 0 && $stockProyectado >= $maximo) {
                $estado = 'OK';
            } else {
                $estado = 'NORMAL';
            }

            $pieza->setAttribute('stock_tienda', $stockActual);
            $pieza->setAttribute('pedido_pendiente', $pendiente);
            $pieza->setAttribute('stock_proyectado', $stockProyectado);
            $pieza->setAttribute('stock_reponer', $reponer);
            $pieza->setAttribute('capas_reposicion', min($capas, 20));
            $pieza->setAttribute('debe_reponer', $debeReponer);
            $pieza->setAttribute('en_corte', $piezaEnCorte);
            $pieza->setAttribute('estado_tienda', $estado);
        });
    }


    private function existeEnArray($value, $array) {

        foreach ($array as $k => $v) {
            if ($value == $v['nombre']) {
                return $k;
            }
        }

        return -1;
    }

    public function store(Request $request) {

        $id = $request->id;
        $data = [
            'codigo' => $request->codigo,
            'capacidad' => $request->capacidad,
            'posicion' => $request->posicion,
            'columnas' => $request->columnas,
        ];


        try {
            if ($id) {
                Lineas::where('id', $id)->update($data);
            } else {
                Lineas::create($data);
            }

            return $this->setResponse([]);
        } catch (\Throwable $th) {
            Log::error("LineasController::store - Error : " . $th->getMessage());
            return $this->setResponse([], "Ocurrió un error. Comuníquese con el encargado de sistemas");
        }
    }
}
