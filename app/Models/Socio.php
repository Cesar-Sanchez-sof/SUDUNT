<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Socio extends Model
{
    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'socios';

    /**
     * Clave primaria de la tabla.
     *
     * @var string
     */
    protected $primaryKey = 'de_codigo';

    /**
     * Indica si la clave primaria es autoincrementable.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Tipo de dato de la clave primaria.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indica si Eloquent debe manejar los campos creadores/modificadores automáticos.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Campos que pueden ser llenados de forma masiva.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'de_codigo',
        'tc',
        'sindical',
        'soc_ff',
        'tip_regimen',
        'nombre',
        'participao',
        'participaf',
        'dni',
        'direccion',
        'correo',
        'fe_nac',
        'fe_ing',
        'fe_cese',
        'fe_fallecido',
        'fe_renuncia',
        'telf_part',
        'telf_trab',
        'telf_movil',
        'n_beni1',
        'n_beni2',
        'cesante',
        'cod_tipo',
        'facultad',
        'depacad',
        'des_cargo',
        'cat_cargo',
        'abr_cargo',
        'sueldo',
        'cuota',
        'Observaciones',
    ];

    /**
     * Atributos que deben ser convertidos a tipos específicos (Casting).
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sindical' => 'boolean',
        'soc_ff' => 'boolean',
        'tip_regimen' => 'integer',
        'participao' => 'boolean',
        'participaf' => 'boolean',
        'cesante' => 'boolean',
        'fe_nac' => 'date:Y-m-d',
        'fe_ing' => 'date:Y-m-d',
        'fe_cese' => 'date:Y-m-d',
        'fe_fallecido' => 'date:Y-m-d',
        'fe_renuncia' => 'date:Y-m-d',
        'sueldo' => 'float',
        'cuota' => 'float',
    ];

    /**
     * Relación con los aportes al Fondo de Financiamiento (FF).
     */
    public function aportesFf(): HasMany
    {
        return $this->hasMany(AporteFf::class, 'de_codigo', 'de_codigo');
    }

    /**
     * Relación con los retiros del Fondo de Financiamiento (FF).
     */
    public function retirosFf(): HasMany
    {
        return $this->hasMany(RetiroFf::class, 'de_codigo', 'de_codigo');
    }

    /**
     * Relación con los préstamos financieros.
     */
    public function prestamos(): HasMany
    {
        return $this->hasMany(Prestamo::class, 'de_codigo', 'de_codigo');
    }

    /**
     * Relación con el saldo consolidado del Fondo de Financiamiento.
     */
    public function consFf(): HasOne
    {
        return $this->hasOne(ConsFf::class, 'de_codigo', 'de_codigo');
    }

    /**
     * Relación con el saldo consolidado del Fondo Mortuorio.
     */
    public function consAfm(): HasOne
    {
        return $this->hasOne(ConsAfm::class, 'de_codigo', 'de_codigo');
    }
}
