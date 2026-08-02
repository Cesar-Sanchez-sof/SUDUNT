<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsFf extends Model
{
    protected $table = 'cons_ff';
    protected $primaryKey = 'de_codigo';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'de_codigo',
        'nombre',
        'tc',
        'socio_ff',
        'cesante',
        'saldo',
        'anterior',
        'ult_aporte',
        'fec_aporte',
        'ult_retiro',
        'fec_retiro',
        'actual',
    ];

    protected $casts = [
        'socio_ff' => 'boolean',
        'cesante' => 'boolean',
        'saldo' => 'float',
        'anterior' => 'float',
        'ult_aporte' => 'float',
        'fec_aporte' => 'date:Y-m-d',
        'ult_retiro' => 'float',
        'fec_retiro' => 'date:Y-m-d',
        'actual' => 'float',
    ];

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class, 'de_codigo', 'de_codigo');
    }
}
