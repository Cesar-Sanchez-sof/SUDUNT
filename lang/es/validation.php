<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Líneas de Lenguaje de Validación
    |--------------------------------------------------------------------------
    |
    | Las siguientes líneas de lenguaje contienen los mensajes de error predeterminados
    | utilizados por la clase de validación.
    |
    */

    'accepted'             => 'El campo :attribute debe ser aceptado.',
    'accepted_if'          => 'El campo :attribute debe ser aceptado cuando :other es :value.',
    'active_url'           => 'El campo :attribute no es una URL válida.',
    'after'                => 'El campo :attribute debe ser una fecha posterior a :date.',
    'after_or_equal'       => 'El campo :attribute debe ser una fecha posterior o igual a :date.',
    'alpha'                => 'El campo :attribute solo puede contener letras.',
    'alpha_dash'           => 'El campo :attribute solo puede contener letras, números, guiones y guiones bajos.',
    'alpha_num'            => 'El campo :attribute solo puede contener letras y números.',
    'array'                => 'El campo :attribute debe ser un array.',
    'ascii'                => 'El campo :attribute solo puede contener caracteres alfanuméricos y símbolos de un solo byte.',
    'before'               => 'El campo :attribute debe ser una fecha anterior a :date.',
    'before_or_equal'      => 'El campo :attribute debe ser una fecha anterior o igual a :date.',
    'between'              => [
        'numeric' => 'El campo :attribute debe ser un valor entre :min y :max.',
        'file'    => 'El archivo :attribute debe pesar entre :min y :max kilobytes.',
        'string'  => 'El campo :attribute debe contener entre :min y :max caracteres.',
        'array'   => 'El campo :attribute debe contener entre :min y :max elementos.',
    ],
    'boolean'              => 'El campo :attribute debe ser verdadero o falso.',
    'confirmed'            => 'La confirmación del campo :attribute no coincide.',
    'current_password'     => 'La contraseña es incorrecta.',
    'date'                 => 'El campo :attribute no es una fecha válida.',
    'date_equals'          => 'El campo :attribute debe ser una fecha igual a :date.',
    'date_format'          => 'El campo :attribute no corresponde al formato :format.',
    'decimal'              => 'El campo :attribute debe tener :decimal decimales.',
    'declined'             => 'El campo :attribute debe ser rechazado.',
    'different'            => 'Los campos :attribute y :other deben ser diferentes.',
    'digits'               => 'El campo :attribute debe tener :digits dígitos.',
    'digits_between'       => 'El campo :attribute debe tener entre :min y :max dígitos.',
    'dimensions'           => 'El campo :attribute tiene dimensiones de imagen no válidas.',
    'distinct'             => 'El campo :attribute tiene un valor duplicado.',
    'email'                => 'El campo :attribute debe ser una dirección de correo válida.',
    'ends_with'            => 'El campo :attribute debe finalizar con uno de los siguientes valores: :values.',
    'enum'                 => 'El campo :attribute seleccionado es inválido.',
    'exists'               => 'El campo :attribute seleccionado es inválido.',
    'file'                 => 'El campo :attribute debe ser un archivo.',
    'filled'               => 'El campo :attribute debe tener un valor.',
    'gt'                   => [
        'numeric' => 'El campo :attribute debe ser mayor que :value.',
        'file'    => 'El archivo :attribute debe pesar más de :value kilobytes.',
        'string'  => 'El campo :attribute debe contener más de :value caracteres.',
        'array'   => 'El campo :attribute debe contener más de :value elementos.',
    ],
    'gte'                  => [
        'numeric' => 'El campo :attribute debe ser mayor o igual que :value.',
        'file'    => 'El archivo :attribute debe pesar :value kilobytes o más.',
        'string'  => 'El campo :attribute debe contener :value caracteres o más.',
        'array'   => 'El campo :attribute debe contener :value elementos o más.',
    ],
    'image'                => 'El campo :attribute debe ser una imagen.',
    'in'                   => 'El campo :attribute seleccionado no es válido.',
    'in_array'             => 'El campo :attribute no existe en :other.',
    'integer'              => 'El campo :attribute debe ser un número entero.',
    'ip'                   => 'El campo :attribute debe ser una dirección IP válida.',
    'ipv4'                 => 'El campo :attribute debe ser una dirección IPv4 válida.',
    'ipv6'                 => 'El campo :attribute debe ser una dirección IPv6 válida.',
    'json'                 => 'El campo :attribute debe ser una cadena JSON válida.',
    'lt'                   => [
        'numeric' => 'El campo :attribute debe ser menor que :value.',
        'file'    => 'El archivo :attribute debe pesar menos de :value kilobytes.',
        'string'  => 'El campo :attribute debe contener menos de :value caracteres.',
        'array'   => 'El campo :attribute debe contener menos de :value elementos.',
    ],
    'lte'                  => [
        'numeric' => 'El campo :attribute debe ser menor o igual que :value.',
        'file'    => 'El archivo :attribute debe pesar :value kilobytes o menos.',
        'string'  => 'El campo :attribute debe contener :value caracteres o menos.',
        'array'   => 'El campo :attribute no debe contener más de :value elementos.',
    ],
    'max'                  => [
        'numeric' => 'El campo :attribute no debe ser mayor que :max.',
        'file'    => 'El archivo :attribute no debe pesar más de :max kilobytes.',
        'string'  => 'El campo :attribute no debe contener más de :max caracteres.',
        'array'   => 'El campo :attribute no debe contener más de :max elementos.',
    ],
    'mimes'                => 'El campo :attribute debe ser un archivo con formato: :values.',
    'mimetypes'            => 'El campo :attribute debe ser un archivo con formato: :values.',
    'min'                  => [
        'numeric' => 'El campo :attribute debe ser al menos :min.',
        'file'    => 'El archivo :attribute debe pesar al menos :min kilobytes.',
        'string'  => 'El campo :attribute debe contener al menos :min caracteres.',
        'array'   => 'El campo :attribute debe contener al menos :min elementos.',
    ],
    'numeric'              => 'El campo :attribute debe ser un número.',
    'password'             => [
        'letters'       => 'El campo :attribute debe contener al menos una letra.',
        'mixed'         => 'El campo :attribute debe contener al menos una letra mayúscula y una minúscula.',
        'numbers'       => 'El campo :attribute debe contener al menos un número.',
        'symbols'       => 'El campo :attribute debe contener al menos un símbolo.',
        'uncompromised' => 'El valor ingresado en :attribute ha aparecido en una filtración de datos. Por favor elija un :attribute diferente.',
    ],
    'present'              => 'El campo :attribute debe estar presente.',
    'required'             => 'El campo :attribute es obligatorio.',
    'required_if'          => 'El campo :attribute es obligatorio cuando :other es :value.',
    'required_unless'      => 'El campo :attribute es obligatorio a menos que :other esté en :values.',
    'required_with'        => 'El campo :attribute es obligatorio cuando :values está presente.',
    'required_with_all'    => 'El campo :attribute es obligatorio cuando :values están presentes.',
    'required_without'     => 'El campo :attribute es obligatorio cuando :values no está presente.',
    'required_without_all' => 'El campo :attribute es obligatorio cuando ninguno de los campos :values están presentes.',
    'same'                 => 'Los campos :attribute y :other deben coincidir.',
    'size'                 => [
        'numeric' => 'El campo :attribute debe ser :size.',
        'file'    => 'El archivo :attribute debe pesar :size kilobytes.',
        'string'  => 'El campo :attribute debe contener :size caracteres.',
        'array'   => 'El campo :attribute debe contener :size elementos.',
    ],
    'starts_with'          => 'El campo :attribute debe comenzar con uno de los siguientes valores: :values.',
    'string'               => 'El campo :attribute debe ser una cadena de texto.',
    'timezone'             => 'El campo :attribute debe ser una zona horaria válida.',
    'unique'               => 'El campo :attribute ya ha sido registrado.',
    'uploaded'             => 'El campo :attribute no se pudo subir.',
    'url'                  => 'El campo :attribute debe ser una URL válida.',
    'uuid'                 => 'El campo :attribute debe ser un UUID válido.',

    /*
    |--------------------------------------------------------------------------
    | Atributos de Validación Personalizados
    |--------------------------------------------------------------------------
    */

    'attributes' => [
        'dni_usuario'  => 'DNI / Código de Usuario',
        'password'     => 'contraseña',
        'email'        => 'correo electrónico',
        'nombre'       => 'nombre',
        'de_codigo'    => 'código de socio',
        'monto'        => 'monto',
        'tasa'         => 'tasa de interés',
        'cuotas'       => 'número de cuotas',
        'fecha'        => 'fecha',
        'cheque'       => 'número de cheque',
        'observacion'  => 'observación',
        'observaciones'=> 'observaciones',
        'documento'    => 'documento',
    ],

];

