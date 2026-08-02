<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cuota extends Model
{
    protected $table = 'progpagpf';
    protected $primaryKey = 'idpagff';
    public $timestamps = false;

    protected $fillable = [
        'de_codigo',
        'pre_codigo',
        'ncuota',
        'principal',
        'fecha',
        'amortiz',
        'interes',
        'cancelado',
        'saldo',
        'estado',
        'observacion',
        'sald_amort',
        'sald_int',
        'des_est',
        'pagomes',
        'usuario',
        'fecsuc',
    ];

    protected $casts = [
        'ncuota' => 'integer',
        'principal' => 'float',
        'fecha' => 'date:Y-m-d',
        'amortiz' => 'float',
        'interes' => 'float',
        'cancelado' => 'boolean',
        'saldo' => 'float',
        'sald_amort' => 'float',
        'sald_int' => 'float',
        'pagomes' => 'float',
        'fecsuc' => 'datetime',
    ];

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class, 'de_codigo', 'de_codigo');
    }

    public function prestamo(): BelongsTo
    {
        return $this->belongsTo(Prestamo::class, 'pre_codigo', 'pre_codigo');
    }
}
