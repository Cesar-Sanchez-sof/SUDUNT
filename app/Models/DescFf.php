<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DescFf extends Model
{
    protected $table = 'desc_ff';
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'de_codigo',
        'tc',
        'fec_mes',
        'de_coddes',
        'de_desdes',
        'fondo_ff',
        'prestamo',
        'interes',
        'no_des',
        'de_import',
        'det_confirma',
        'observaciones',
        'confirmado',
        'sobregiro',
        'cesante',
        'nombre',
    ];

    protected $casts = [
        'fec_mes' => 'date:Y-m-d',
        'fondo_ff' => 'float',
        'prestamo' => 'float',
        'interes' => 'float',
        'no_des' => 'float',
        'de_import' => 'float',
        'confirmado' => 'integer',
        'sobregiro' => 'float',
        'cesante' => 'boolean',
    ];
}
