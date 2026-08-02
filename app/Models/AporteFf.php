<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AporteFf extends Model
{
    protected $table = 'aportesff';
    protected $primaryKey = 'idaportes';
    public $timestamps = false;

    protected $fillable = [
        'de_codigo',
        'monto',
        'fecha',
        'recibo',
        'observaciones',
        'usuario',
    ];

    protected $casts = [
        'monto' => 'float',
        'fecha' => 'date:Y-m-d',
    ];

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class, 'de_codigo', 'de_codigo');
    }
}
