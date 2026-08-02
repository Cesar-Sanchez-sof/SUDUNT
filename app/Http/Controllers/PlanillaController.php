<?php

namespace App\Http\Controllers;

use App\Services\PayrollService;
use App\Models\DescFf;
use App\Models\DescOrd;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

class PlanillaController extends Controller
{
    protected $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    /**
     * Panel de control de planillas mensuales.
     */
    public function index(Request $request): Response
    {
        // Mes seleccionado o mes actual por defecto (Y-m-d)
        $month = $request->input('month', Carbon::now()->startOfMonth()->format('Y-m-d'));
        
        $fec_mes = Carbon::parse($month)->startOfMonth()->format('Y-m-d');

        // Buscar planillas del mes
        $planillasFf = DescFf::where('fec_mes', $fec_mes)->orderBy('nombre')->get();
        $planillasOrd = DescOrd::where('fec_mes', $fec_mes)->orderBy('nombre')->get();

        // Determinar el estado general
        $isGenerated = !$planillasFf->isEmpty() || !$planillasOrd->isEmpty();
        
        // Verificar si ya está confirmado (se asume confirmado si tiene registros y el primero está marcado como tal)
        $isConfirmed = false;
        if ($isGenerated) {
            $firstFf = $planillasFf->first();
            $firstOrd = $planillasOrd->first();
            $isConfirmed = ($firstFf && $firstFf->confirmado === 1) || ($firstOrd && $firstOrd->confirmado === 1);
        }

        // Totales de resumen
        $resumenFf = [
            'total_ahorro' => (float)$planillasFf->sum('fondo_ff'),
            'total_prestamo' => (float)$planillasFf->sum('prestamo'),
            'total_interes' => (float)$planillasFf->sum('interes'),
            'total_deducido' => (float)$planillasFf->sum('de_import'),
        ];

        $resumenOrd = [
            'total_cuota' => (float)$planillasOrd->sum('cuota'),
            'total_mortuorio' => (float)$planillasOrd->sum('fondo_mort'),
            'total_otros' => (float)$planillasOrd->sum(function($item) {
                return $item->asamblea + $item->encargos + $item->canasta + $item->salud + $item->otros + $item->fondom;
            }),
            'total_deducido' => (float)$planillasOrd->sum('de_import'),
        ];

        return Inertia::render('Planillas/Index', [
            'planillasFf' => $planillasFf,
            'planillasOrd' => $planillasOrd,
            'isGenerated' => $isGenerated,
            'isConfirmed' => $isConfirmed,
            'resumenFf' => $resumenFf,
            'resumenOrd' => $resumenOrd,
            'selectedMonth' => $fec_mes,
        ]);
    }

    /**
     * Generar borradores de planillas para el mes seleccionado.
     */
    public function generar(Request $request): RedirectResponse
    {
        $request->validate([
            'month' => 'required|date',
        ]);

        $month = $request->input('month');
        $fec_mes = Carbon::parse($month)->startOfMonth()->format('Y-m-d');

        try {
            $res = $this->payrollService->generate($fec_mes);
            return redirect()->route('planillas.index', ['month' => $fec_mes])
                ->with('success', "Planillas preliminares del mes generadas correctamente. FF: {$res['fondo_fijo_generados']}, ORD: {$res['ordinarias_generados']}");
        } catch (\Exception $e) {
            return redirect()->route('planillas.index', ['month' => $fec_mes])
                ->with('error', "Error al generar planillas: " . $e->getMessage());
        }
    }

    /**
     * Confirmar y cerrar las planillas del mes, aplicando los fondos y cobrando las cuotas.
     */
    public function confirmar(Request $request): RedirectResponse
    {
        $request->validate([
            'month' => 'required|date',
        ]);

        $month = $request->input('month');
        $fec_mes = Carbon::parse($month)->startOfMonth()->format('Y-m-d');

        try {
            $res = $this->payrollService->confirm($fec_mes);
            return redirect()->route('planillas.index', ['month' => $fec_mes])
                ->with('success', "Planilla cerrada con éxito. Se aplicaron {$res['aportes_fondo_fijo_aplicados']} aportes y se cobraron {$res['cuotas_prestamos_cobradas']} cuotas de préstamos.");
        } catch (\Exception $e) {
            return redirect()->route('planillas.index', ['month' => $fec_mes])
                ->with('error', "Error al confirmar la planilla: " . $e->getMessage());
        }
    }
}
