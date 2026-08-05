<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use App\Models\Prestamo;
use App\Models\Cuota;
use App\Services\LoanSimulatorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PrestamoController extends Controller
{
    protected $simulator;

    public function __construct(LoanSimulatorService $simulator)
    {
        $this->simulator = $simulator;
    }

    /**
     * Mostrar vista del simulador y procesar simulación preliminar.
     */
    public function simular(Request $request): Response
    {
        $de_codigo = $request->input('de_codigo');
        $monto = $request->input('monto');
        $tasa = $request->input('tasa');
        $cuotas = $request->input('cuotas');
        $fecha = $request->input('fecha', date('Y-m-d'));

        $socio = $de_codigo ? Socio::find($de_codigo) : null;
        $resultado = null;

        if ($monto && $tasa && $cuotas) {
            $resultado = $this->simulator->simulate(
                (float)$monto,
                (float)$tasa,
                (int)$cuotas,
                $fecha
            );
        }

        // Obtener lista rápida de socios para el selector del simulador
        $sociosList = Socio::select('de_codigo', 'nombre', 'dni')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Prestamos/Simular', [
            'socio' => $socio,
            'resultado' => $resultado,
            'sociosList' => $sociosList,
            'filters' => $request->only(['de_codigo', 'monto', 'tasa', 'cuotas', 'fecha']),
        ]);
    }

    /**
     * Registrar desembolso de préstamo y generar cronograma de cuotas (Transacción Atómica).
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'de_codigo' => 'required|exists:socios,de_codigo',
            'monto' => 'required|numeric|min:1',
            'tasa' => 'required|numeric|min:0',
            'cuotas' => 'required|integer|min:1|max:120',
            'fecha' => 'required|date',
            'cheque' => 'required|string|max:20',
            'observacion' => 'nullable|string|max:30',
        ]);

        $de_codigo = $request->input('de_codigo');
        $monto = (float)$request->input('monto');
        $tasa = (float)$request->input('tasa');
        $cuotas = (int)$request->input('cuotas');
        $fecha = $request->input('fecha');
        $cheque = $request->input('cheque');
        $observacion = $request->input('observacion') ?? 'PRÉSTAMO REGISTRADO';

        // 1. Simular para obtener los valores exactos e installments
        $simulacion = $this->simulator->simulate($monto, $tasa, $cuotas, $fecha);

        // Intentar registrar el préstamo y sus cuotas atómicamente
        DB::transaction(function () use ($de_codigo, $monto, $tasa, $cuotas, $fecha, $cheque, $observacion, $simulacion) {
            // Generar código de préstamo correlativo: e.g., P000001, P000002
            $lastPrestamo = Prestamo::where('pre_codigo', 'like', 'P%')
                ->orderBy('pre_codigo', 'desc')
                ->first();

            $nextNumber = 1;
            if ($lastPrestamo) {
                // Extraer la parte numérica del código anterior (e.g. P001234 -> 1234)
                $numericPart = preg_replace('/[^0-9]/', '', $lastPrestamo->pre_codigo);
                $nextNumber = ((int)$numericPart) + 1;
            }
            // Formatear código a 7 caracteres de ancho: 'P' + 6 dígitos
            $pre_codigo = 'P' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

            // 2. Crear registro de Préstamo
            $prestamo = Prestamo::create([
                'pre_codigo' => $pre_codigo,
                'de_codigo' => $de_codigo,
                'fecha' => $fecha,
                'cheque' => $cheque,
                'monto' => $monto,
                'costfin' => $simulacion['costfin'],
                'tasa' => $tasa,
                'saldo' => $monto, // Saldo inicial es el capital solicitado
                'principal' => $monto,
                'cancelado' => 0,
                'observacion' => $observacion,
                'nulo' => 0,
                'ncuota' => $cuotas,
                'reprog' => 0,
            ]);

            // 3. Crear registros de cuotas en la tabla progpagpf
            foreach ($simulacion['cronograma'] as $c) {
                Cuota::create([
                    'de_codigo' => $de_codigo,
                    'pre_codigo' => $pre_codigo,
                    'ncuota' => $c['ncuota'],
                    'principal' => $c['principal'],
                    'fecha' => $c['fecha'],
                    'amortiz' => $c['amortiz'],
                    'interes' => $c['interes'],
                    'cancelado' => 0,
                    'saldo' => $c['saldo'],
                    'estado' => 'P',
                    'observacion' => '',
                    'sald_amort' => $c['amortiz'],
                    'sald_int' => $c['interes'],
                    'des_est' => 'PENDIENTE',
                    'pagomes' => $c['pagomes'],
                    'usuario' => substr(auth()->user()->nom_usuario ?? 'ADMIN', 0, 10),
                    'fecsuc' => now(),
                ]);
            }
        });

        return redirect()->route('socios.show', $de_codigo)
            ->with('success', 'Préstamo desembolsado y cronograma generado correctamente.');
    }
}
