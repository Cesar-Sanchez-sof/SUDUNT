<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SucFondo extends Model
{
    protected $table = 'suc_fondo';
    protected $primaryKey = 'idsucesos';
    public $timestamps = false;

    protected $fillable = [
        'usuario',
        'tabla',
        'fecsuc',
        'registro',
        'de_codigo',
        'pre_codigo',
        'monto',
        'fecha',
        'documento',
        'observaciones',
    ];

    protected $casts = [
        'fecsuc' => 'datetime',
        'monto' => 'float',
        'fecha' => 'date:Y-m-d',
        'registro' => 'integer',
    ];
}
