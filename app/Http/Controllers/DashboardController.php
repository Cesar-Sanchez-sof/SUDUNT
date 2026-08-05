<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use App\Models\Prestamo;
use App\Models\ConsFf;
use App\Models\ConsAfm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Estadísticas básicas
        $totalSocios = Socio::count();
        $sociosActivos = Socio::where('cesante', 0)->count();
        $sociosCesantes = Socio::where('cesante', 1)->count();
        
        $carteraActiva = (float)Prestamo::where('cancelado', 0)->sum('saldo');
        $totalDesembolsado = (float)Prestamo::sum('monto');
        
        $ahorroFondoFijo = (float)ConsFf::sum('actual');
        $ahorroFondoMortuorio = (float)ConsAfm::sum('actual');

        // 2. Historial de los últimos 6 meses para el gráfico interactivo
        $savingsHistory = DB::table('aportesff')
            ->select(DB::raw("TO_CHAR(fecha, 'YYYY-MM') as month"), DB::raw("SUM(monto) as total_ahorro"))
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get()
            ->reverse()
            ->values();

        $loansHistory = DB::table('prestfin')
            ->select(DB::raw("TO_CHAR(fecha, 'YYYY-MM') as month"), DB::raw("SUM(monto) as total_prestamo"))
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get()
            ->reverse()
            ->values();

        // Combinar datos por mes para Recharts
        $months = collect($savingsHistory->pluck('month'))
            ->merge($loansHistory->pluck('month'))
            ->unique()
            ->sort()
            ->values();

        Carbon::setLocale('es');
        $chartData = [];
        foreach ($months as $m) {
            $ahorro = $savingsHistory->firstWhere('month', $m)->total_ahorro ?? 0.0;
            $prestamo = $loansHistory->firstWhere('month', $m)->total_prestamo ?? 0.0;
            
            $monthName = Carbon::parse($m . '-01')->translatedFormat('M Y');
            
            $chartData[] = [
                'name' => ucfirst($monthName),
                'Ahorros' => (float)$ahorro,
                'Préstamos' => (float)$prestamo,
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalSocios' => $totalSocios,
                'sociosActivos' => $sociosActivos,
                'sociosCesantes' => $sociosCesantes,
                'carteraActiva' => $carteraActiva,
                'totalDesembolsado' => $totalDesembolsado,
                'ahorroFondoFijo' => $ahorroFondoFijo,
                'ahorroFondoMortuorio' => $ahorroFondoMortuorio,
            ],
            'chartData' => $chartData,
        ]);
    }
}
