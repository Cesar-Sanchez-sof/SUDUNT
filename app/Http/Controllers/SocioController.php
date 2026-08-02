<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use App\Models\ConsFf;
use App\Models\ConsAfm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SocioController extends Controller
{
    /**
     * Mostrar listado de socios con buscador y paginación.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $socios = Socio::query()
            ->when($search, function ($query, $search) {
                // 'ilike' es específico de PostgreSQL para búsquedas insensibles a mayúsculas
                $query->where('nombre', 'ilike', "%{$search}%")
                    ->orWhere('de_codigo', 'ilike', "%{$search}%")
                    ->orWhere('dni', 'like', "%{$search}%");
            })
            ->orderBy('nombre')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Socios/Index', [
            'socios' => $socios,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Mostrar ficha de un socio, sus saldos consolidados e historial de aportes, retiros y préstamos.
     */
    public function show(string $de_codigo): Response
    {
        $socio = Socio::findOrFail($de_codigo);

        // Obtener saldos consolidados o retornar una instancia vacía si no existe registro
        $consFf = $socio->consFf()->first() ?? new ConsFf([
            'de_codigo' => $de_codigo,
            'saldo' => 0.0,
            'anterior' => 0.0,
            'ult_aporte' => 0.0,
            'fec_aporte' => '1900-01-01',
            'ult_retiro' => 0.0,
            'fec_retiro' => '1900-01-01',
            'actual' => 0.0,
        ]);

        $consAfm = $socio->consAfm()->first() ?? new ConsAfm([
            'de_codigo' => $de_codigo,
            'ult_aporte' => 0.0,
            'fec_aporte' => '1900-01-01',
            'ult_retiro' => 0.0,
            'fec_retiro' => '1900-01-01',
            'actual' => 0.0,
        ]);

        // Historial completo
        $aportes = $socio->aportesFf()->orderBy('fecha', 'desc')->get();
        $retiros = $socio->retirosFf()->orderBy('fecha', 'desc')->get();
        $prestamos = $socio->prestamos()->orderBy('fecha', 'desc')->get();

        return Inertia::render('Socios/Show', [
            'socio' => $socio,
            'consFf' => $consFf,
            'consAfm' => $consAfm,
            'aportes' => $aportes,
            'retiros' => $retiros,
            'prestamos' => $prestamos,
        ]);
    }
}
