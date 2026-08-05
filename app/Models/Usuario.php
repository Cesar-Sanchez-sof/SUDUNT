<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use Notifiable;

    /**
     * Tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'usuarios';

    /**
     * Clave primaria de la tabla.
     *
     * @var string
     */
    protected $primaryKey = 'id_usuario';

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
    protected $keyType = 'int';

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
        'id_usuario',
        'dni_usuario',
        'clv_usuario',
        'nom_usuario',
        'car_usuario',
        'niv_usuario',
    ];

    /**
     * Campos ocultos para serialización.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'clv_usuario',
    ];

    /**
     * Obtener el nombre de la columna para la contraseña de autenticación.
     * Sobrescribe el valor predeterminado 'password' de Laravel.
     *
     * @return string
     */
    public function getAuthPasswordName()
    {
        return 'clv_usuario';
    }

    /**
     * Obtener la contraseña de autenticación.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->clv_usuario;
    }
}
