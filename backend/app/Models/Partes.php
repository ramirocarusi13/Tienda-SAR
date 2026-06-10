<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Partes extends Model {
    use HasFactory;

    protected $fillable = ['modelo_id', 'activo', 'vehiculo_id', 'codigo', 'tipo_id', 'lado_id', 'imagen'];

    public function vehiculo(): HasOne {
        return $this->hasOne(Vehiculos::class, 'id', 'vehiculo_id');
    }

    public function tipo(): HasOne {
        return $this->hasOne(TipoPartes::class, 'id', 'tipo_id');
    }

    public function lado(): HasOne {
        return $this->hasOne(LadoPartes::class, 'id', 'lado_id');
    }

    public function piezas() {
        return $this->hasMany(Piezas::class, 'parte_id', 'id');
    }

    public function modelo() {
        return $this->hasMany(Modelos::class, 'id', 'modelo_id')->where('activo', 1);
    }
}
