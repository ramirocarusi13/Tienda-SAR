<?php

namespace App\Services;

use App\Http\EstadosQr;
use App\Http\LineasModelo;
use App\Models\EpEtiqueta;
use App\Models\EpEtiquetaMid;
use App\Models\Modelos;
use App\Models\Sar\TEtiquetaAirbag;
use DateInterval;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EtiquetaService {

    static function creaEtiquetaAirbagDesdeBaseSAR(string $qr) {
        //ESTADO 2 ES PARA QUE NO ESTE ESCRAPEADA
        $dataAirbag = TEtiquetaAirbag::with('mod')->where('ID', $qr)->where('estado', '<>', 2)->first();
        $data = null;

        if ($dataAirbag) {
            //GENERO LA ETIQUETA EN LA BASE
            try {
                $modeloAirbag = Modelos::where('nombre', $dataAirbag->mod->MODELO)->first();
            } catch (\Throwable $th) {
                $modeloAirbag = null;
            }

            $data = EpEtiqueta::create([
                'airbag'            => true,
                'kanban'            => null,
                'id_etiqueta'       => 0,
                'modelo'            => $modeloAirbag ? $modeloAirbag->nombre : null,
                'lado'              => $dataAirbag->LADO == 'L' ? 'LH' : 'RH',
                'secuencia'         => str_pad($dataAirbag->SECUENCIA, 4, "0", STR_PAD_LEFT),
                'estado'            => EstadosQr::VALIDADA,
                'qr'                => $qr,
                'ubicacion'         => '',
                'tipo'              => 'BC',
                'vehiculo'          => '',
                'codigo'            => '',
                'linea'             => $dataAirbag->LINEA,
                'kanban_impresion'  => '',
                'modelo_id'         => $modeloAirbag ? $modeloAirbag->id : null,
                'linea_real'        => $dataAirbag->LINEA,
            ]);

            EpEtiquetaMid::create([
                'qr'            => $qr,
                'modelo_id'     => $modeloAirbag ? $modeloAirbag?->id : null,
                'linea_real'    => $dataAirbag->LINEA
            ]);
        }

        return $data;
    }

    static function getEtiquetaPorQr(string $qr) {
        return EpEtiqueta::where('qr', $qr)->first();
    }

    public function generarEtiqueta(object $etiquetaData) {

        $codigoKanban = $etiquetaData->kanban;
        $linea = $etiquetaData->linea;
        $user = $etiquetaData->userId;
        $lineaOriginal = '';

        $kanban =  KanbanService::getKanban($codigoKanban);
        $partes = ParteService::getPartesByKanban($kanban);

        if (is_null($linea)) {
            $linea = ModeloLineaService::getPrimerLineaDeModelo($kanban->modelo);
        }

        if (is_null($linea)) {
            $linea = "1";
        }

        $lineaOriginal = $linea;

        if (strlen($linea) > 1) {
            $linea = "0"; //Todas las lineas que sean de 2 digitos van en 0 por pedido de TBAR
        }

        $ubicacion = $kanban->modelo->fila->fila;
        if ($ubicacion == 'FRONT') {
            $ubicacion = 'FR';
        } else if ($ubicacion == 'REAR 1') {
            $ubicacion = 'R1';
        } else if ($ubicacion == 'REAR 2') {
            $ubicacion = 'R2';
        } else if ($ubicacion == 'REAR 3') {
            $ubicacion = 'R3';
        } else if ($ubicacion == 'SUP') {
            $ubicacion = 'SU';
        }

        $secuenciaInicial = EtiquetaService::getProximoNumeroSecuencia();

        DB::beginTransaction();

        foreach ($partes as $parte) {
            for ($i = 0; $i < $kanban->modelo->cantidad; $i++) {
                $lado = $parte->lado->lado;

                if ($lado == '100%') {
                    $lado = '00';
                }

                $tipoSeat = 'CS';

                if ($parte->tipo->tipo == 'CUSHION') {
                    $tipoSeat = 'CS';
                } else {
                    if (($lado != 'RH' && $lado != 'LH') || $parte->tipo->tipo == 'BACK') {
                        $tipoSeat = 'BC';
                    }
                }

                $parteCodigo = $parte->codigo;

                if (strlen($parte->codigo) == 13) {
                    $parteCodigo = $parte->codigo . '0';
                } else if (strlen($parte->codigo) == 12) {
                    $parteCodigo = $parte->codigo . '00';
                } else if (strlen($parte->codigo) == 11) {
                    $parteCodigo = $parte->codigo . '-00';
                }

                $secuencia = str_pad($secuenciaInicial, 4, "0", STR_PAD_LEFT);
                $qr = date("Ydm") . "1" . $secuencia . $parteCodigo . $ubicacion . $lado . $tipoSeat  . $linea . '1SAR000';

                if (!$this->validaEtiquetaDuplicada($qr)) {
                    DB::rollBack();
                    Log::error('EpEtiquetaController::store : Se aborta creación de etiquetas. Etiqueta duplicada en el último día : ' . $qr);
                    // return $this->setResponse([], 'El sistema detecto que se van a generar etiquetas duplicadas. Comuníquese con el encargado de IT.', true);
                }

                $secuenciaInicial = $secuenciaInicial + 1;
                if ($secuenciaInicial >= 9999) {
                    $secuenciaInicial = 0;
                }
            }
        }
    }

    public function crearEtiqueta(
        string $codigoKanban,
        Modelos $modelo,
        string $lado,
        int $secuencia,
        EstadosQr $estado,
        string $ubicacion,
        string $tipo,
        string $linea,
        string $lineaReal,
        string $partNumber,
        int $userId
    ) {

        $qr = '';

        $creada = EpEtiqueta::create([
            'kanban_impresion'  => $codigoKanban,
            'id_etiqueta'       => 0,
            'modelo'            => $modelo->nombre,
            'modelo_id'         => $modelo->id,
            'lado'              => $lado,
            'secuencia'         => $secuencia,
            'estado'            => $estado,
            'qr'                => $qr,
            'ubicacion'         => $ubicacion,
            'tipo'              => $tipo,
            'linea'             => $linea,
            'linea_real'        => $lineaReal,
            'codigo'            => $partNumber, //$tipo->codigo,
            'user_id'           => $userId,
            'vehiculo'          => LineasModelo::VEHICULOS[$modelo->nombre],
        ]);

        EpEtiquetaMid::create([
            'qr'            => $qr,
            'modelo_id'     => $modelo->id,
            'linea_real'    => $lineaReal
        ]);
    }

    private function validaEtiquetaDuplicada(string $qr): bool {
        //VERIFICO SI LA ETIQUETA EXISTE EN EL ÚLTIMO DÍA

        $fecha = new DateTime();
        $fecha->sub(new DateInterval('P1D'));
        $existe = EpEtiqueta::where('qr', $qr)->where('created_at', '>=', $fecha)->first();

        return ($existe ? false : true);
    }

    static function getProximoNumeroSecuencia(): int {
        /**
         * FUNCION CONTROLADA OK
         */
        // $existente = EpEtiqueta::orderBy('id', 'DESC')->first();
        // if ($existente) {
        //     $secuencia = intval($existente->secuencia) + 1;

        //     if ($secuencia >= 9999) {
        //         $secuencia = 0;
        //     }
        // } else {
        //     $secuencia = 0;
        // }

        // return $secuencia;
        $secuenciaInicial = 0;

        $existente = EpEtiqueta::where('estado', '<>', 'RETRABAJO')
            ->where('estado', '<>', 'SCRAP')
            ->where(function ($q) {
                $q->where('airbag', false);
                $q->orWhere('airbag', null);
            })
            ->orderBy('id', 'DESC')->first();

        if ($existente) {
            $secuenciaInicial = intval($existente->secuencia) + 1;
            if ($secuenciaInicial >= 9999) {
                $secuenciaInicial = 0;
            }
        } else {
            $secuenciaInicial = 0;
        }

        return $secuenciaInicial;
    }
}
