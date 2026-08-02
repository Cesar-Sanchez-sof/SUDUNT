<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DescOrd extends Model
{
    protected $table = 'desc_ord';
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'de_codigo',
        'tc',
        'fec_mes',
        'de_coddes',
        'de_desdes',
        'asamblea',
        'encargos',
        'cuota',
        'fondo_mort',
        'credito',
        'prestamo',
        'canasta',
        'salud',
        'nodes',
        'otros',
        'de_import',
        'observaciones',
        'confirmado',
        'sobregiro',
        'cesante',
        'nombre',
        'aportefm',
        'fondom',
    ];

    protected $casts = [
        'fec_mes' => 'date:Y-m-d',
        'asamblea' => 'float',
        'encargos' => 'float',
        'cuota' => 'float',
        'fondo_mort' => 'float',
        'credito' => 'float',
        'prestamo' => 'float',
        'canasta' => 'float',
        'salud' => 'float',
        'nodes' => 'float',
        'otros' => 'float',
        'de_import' => 'float',
        'confirmado' => 'integer',
        'sobregiro' => 'float',
        'cesante' => 'boolean',
        'aportefm' => 'float',
        'fondom' => 'float',
    ];
}
