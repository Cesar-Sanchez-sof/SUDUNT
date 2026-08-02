<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prestamo extends Model
{
    protected $table = 'prestfin';
    protected $primaryKey = 'idprestamo';
    public $timestamps = false;

    protected $fillable = [
        'pre_codigo',
        'de_codigo',
        'fecha',
        'cheque',
        'monto',
        'costfin',
        'tasa',
        'saldo',
        'principal',
        'cancelado',
        'observacion',
        'nulo',
        'ncuota',
        'reprog',
    ];

    protected $casts = [
        'fecha' => 'date:Y-m-d',
        'monto' => 'float',
        'costfin' => 'float',
        'tasa' => 'float',
        'saldo' => 'float',
        'principal' => 'float',
        'cancelado' => 'boolean',
        'nulo' => 'boolean',
        'ncuota' => 'integer',
        'reprog' => 'boolean',
    ];

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class, 'de_codigo', 'de_codigo');
    }

    /**
     * Relación con las cuotas del cronograma de pagos.
     */
    public function cuotas(): HasMany
    {
        return $this->hasMany(Cuota::class, 'pre_codigo', 'pre_codigo');
    }
}
