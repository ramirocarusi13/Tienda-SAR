<?php

namespace App\Http\Controllers;

use App\Http\Jerarquias;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UsersControllers extends Controller {

    private function esDepartamentoCalidad($departamento): bool {
        return strtoupper(trim((string) $departamento)) === 'CALIDAD';
    }

    private function puedeAutorizarImpresionQr($user): bool {
        return (int) $user->rol >= Jerarquias::GROUP_LEADER || $this->esDepartamentoCalidad($user->departamento);
    }

    public function index() {
        $data = User::with(['linea', 'operacion'])->get()->toArray();
        return $this->setResponse($data);
    }

    public function get($id) {
        $data = User::with(['polivalencias.operacion'])->where('id', $id)->first()->toArray();
        return $this->setResponse($data);
    }

    public function userValidoByCodAutorizacion(Request $request) {
        $user = User::select('id', 'name', 'email', 'rol', 'turno', 'area', 'departamento')->with(['rol'])->where('cod_autorizacion', $request->codigo)->first();

        if ($user) {
            $token = $user->createToken('Laravel Password Grant Client')->accessToken;

            return $this->setResponse([
                'id'            => $user->id,
                'token'         => $token,
                'name'          => $user->name,
                'email'         => $user->email,
                'rol'           => $user->rol,
                'turno'         => $user->turno,
                'area'          => $user->area,
                'departamento'  => $user->departamento,
            ]);
        } else {
            return $this->setResponse([], 'Código de autorización inválido', true);
        }
    }

    public function validarImpresionQrAutorizacion(Request $request) {
        $codigo = trim($request->codigo ?? '');

        if ($codigo === '') {
            return $this->setResponse([], 'Ingrese el codigo de autorizacion', true);
        }

        $user = User::select('id', 'name', 'email', 'rol', 'turno', 'area', 'departamento')
            ->where('cod_autorizacion', $codigo)
            ->first();

        if (!$user) {
            return $this->setResponse([], 'Codigo de autorizacion invalido', true);
        }

        if (!$this->puedeAutorizarImpresionQr($user)) {
            return $this->setResponse([], 'Usuario sin permiso para imprimir QR de autorizacion', true);
        }

        return $this->setResponse([
            'id'            => $user->id,
            'name'          => $user->name,
            'email'         => $user->email,
            'rol'           => $user->rol,
            'turno'         => $user->turno,
            'area'          => $user->area,
            'departamento'  => $user->departamento,
        ]);
    }

    public function qrAutorizacionIndex(Request $request) {
        $codigo = trim($request->codigo ?? '');
        $search = trim($request->search ?? '');
        $sector = trim($request->sector ?? '');

        $autorizante = User::select('id', 'rol', 'departamento')
            ->where('cod_autorizacion', $codigo)
            ->first();

        if (!$autorizante || !$this->puedeAutorizarImpresionQr($autorizante)) {
            return $this->setResponse([], 'Usuario sin permiso para consultar QR de autorizacion', true);
        }

        $users = User::select('id', 'name', 'email', 'cod_autorizacion', 'rol', 'turno', 'area', 'departamento')
            ->whereNotNull('cod_autorizacion')
            ->where('cod_autorizacion', '<>', '')
            ->whereNotNull('rol')
            ->where('rol', '<=', Jerarquias::GROUP_LEADER)
            ->where(function ($query) {
                $query->where('activo', true)
                    ->orWhereNull('activo');
            })
            ->when($this->esDepartamentoCalidad($autorizante->departamento), function ($query) {
                $query->whereRaw('UPPER(departamento) = ?', ['CALIDAD']);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%')
                        ->orWhere('area', 'like', '%' . $search . '%')
                        ->orWhere('departamento', 'like', '%' . $search . '%');
                });
            })
            ->when($sector !== '', function ($query) use ($sector) {
                $query->where(function ($q) use ($sector) {
                    $q->where('area', 'like', '%' . $sector . '%')
                        ->orWhere('departamento', 'like', '%' . $sector . '%');
                });
            })
            ->orderBy('departamento')
            ->orderBy('area')
            ->orderBy('email')
            ->get()
            ->toArray();

        return $this->setResponse($users);
    }

    public function updateUserData(Request $request) {
        // Log::alert($request);
        $usuario = UserService::updateData($request->userId, $request->data, $request?->lineaData);
        return $this->setResponse([]);
    }

    public function store(Request $request) {

        $usuario = UserService::createUser($request->data, $request?->lineaData);
        // Log::alert($usuario);
        return $this->setResponse($usuario ? $usuario->toArray() : []);
    }

    public function getUsersPorLinea($linea) {

        if ($linea == 0) {
            $linea = 10;
        }

        $usuarios = UserService::obtenerMembersPorLinea($linea);
        return $this->setResponse($usuarios);
    }

    public function getUsersPorDepartamento($departamento) {

        $usuarios = UserService::obtenerMembersPorDepartamento($departamento);
        return $this->setResponse($usuarios);
    }
}
