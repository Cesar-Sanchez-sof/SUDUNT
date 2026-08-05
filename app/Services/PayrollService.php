<?php

namespace App\Services;

use App\Models\Socio;
use App\Models\DescFf;
use App\Models\DescOrd;
use App\Models\ConsFf;
use App\Models\ConsAfm;
use App\Models\Cuota;
use App\Models\Prestamo;
use App\Models\SucFondo;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PayrollService
{
    /**
     * Generar borradores de planillas (Fondo Fijo y Ordinaria) para un mes específico.
     * 
     * @param string $fec_mes Fecha del primer día del mes (Y-m-d, ej: 2026-08-01).
     * @return array
     */
    public function generate(string $fec_mes): array
    {
        $date = Carbon::parse($fec_mes)->startOfMonth();
        $fec_mes_clean = $date->format('Y-m-d');
        
        $startOfMonth = $date->copy()->startOfMonth()->format('Y-m-d');
        $endOfMonth = $date->copy()->endOfMonth()->format('Y-m-d');

        // Intentar realizar el cálculo dentro de una transacción
        return DB::transaction(function () use ($fec_mes_clean, $startOfMonth, $endOfMonth) {
            // 1. Eliminar borradores previos no confirmados para este mes
            DescFf::where('fec_mes', $fec_mes_clean)->where('confirmado', 0)->delete();
            DescOrd::where('fec_mes', $fec_mes_clean)->where('confirmado', 0)->delete();

            // 0. Cargar todas las tablas auxiliares en memoria (Optimización N+1)
            $cuotasMes = Cuota::where('cancelado', 0)
                ->whereBetween('fecha', [$startOfMonth, $endOfMonth])
                ->get()
                ->groupBy('de_codigo');

            $asambleasMap = DB::table('asamblea')->pluck('aporte', 'de_codigo')->toArray();
            $encargosMap = DB::table('encargo')->pluck('aporte', 'de_codigo')->toArray();
            $fondosMap = DB::table('fondo')->pluck('aporte', 'de_codigo')->toArray();
            $canaviMap = DB::table('canavi')->pluck('aporte', 'de_codigo')->toArray();
            $ayuexsaMap = DB::table('ayuexsa')->pluck('aporte', 'de_codigo')->toArray();
            $otrosMap = DB::table('otros')->pluck('aporte', 'de_codigo')->toArray();
            $fonhijoMap = DB::table('tbl_fonhijo')->pluck('aporte', 'de_codigo')->toArray();
            $otrosDsctosMap = DB::table('otros_dsctos')->pluck('c_fonmor', 'tipoempl')->toArray();

            $socios = Socio::all();
            $countFf = 0;
            $countOrd = 0;

            foreach ($socios as $socio) {
                $de_codigo = $socio->de_codigo;

                // --- 2. GENERAR PLANILLA DE FONDO FIJO (desc_ff) ---
                if ($socio->soc_ff) {
                    $socioCuotas = $cuotasMes->get($de_codigo) ?? collect();
                    $prestamoAmortiz = (float)$socioCuotas->sum('amortiz');
                    $prestamoInteres = (float)$socioCuotas->sum('interes');
                    
                    // Aporte fondo fijo del socio (cuota en tabla socios)
                    $fondoFf = (float)$socio->cuota; 
                    $totalImportFf = $fondoFf + $prestamoAmortiz + $prestamoInteres;

                    DescFf::create([
                        'de_codigo' => $de_codigo,
                        'tc' => $socio->tc ?? '01',
                        'fec_mes' => $fec_mes_clean,
                        'de_coddes' => '0001', // Código ficticio de descuento
                        'de_desdes' => 'FONDO FIJO',
                        'fondo_ff' => $fondoFf,
                        'prestamo' => $prestamoAmortiz,
                        'interes' => $prestamoInteres,
                        'no_des' => 0.0,
                        'de_import' => $totalImportFf,
                        'det_confirma' => 'BORRADOR',
                        'observaciones' => 'PROYECCIÓN MENSUAL',
                        'confirmado' => 0,
                        'sobregiro' => 0.0,
                        'cesante' => $socio->cesante ? 1 : 0,
                        'nombre' => $socio->nombre,
                    ]);
                    $countFf++;
                }

                // --- 3. GENERAR PLANILLA ORDINARIA (desc_ord) ---
                if ($socio->sindical) {
                    // Cargar aportes desde los mapas en memoria
                    $asamblea = (float)($asambleasMap[$de_codigo] ?? 0.0);
                    $encargos = (float)($encargosMap[$de_codigo] ?? 0.0);
                    $cuotaSindicato = (float)($fondosMap[$de_codigo] ?? 15.0);
                    
                    $tipoempl = $socio->cesante ? 2 : 1;
                    $fondoMort = (float)($otrosDsctosMap[$tipoempl] ?? 10.0);
                    
                    $canasta = (float)($canaviMap[$de_codigo] ?? 0.0);
                    $salud = (float)($ayuexsaMap[$de_codigo] ?? 0.0);
                    $otros = (float)($otrosMap[$de_codigo] ?? 0.0);
                    $fondom = (float)($fonhijoMap[$de_codigo] ?? 0.0);

                    $totalImportOrd = $asamblea + $encargos + $cuotaSindicato + $fondoMort + $canasta + $salud + $otros + $fondom;

                    DescOrd::create([
                        'de_codigo' => $de_codigo,
                        'tc' => substr($socio->tc ?? '01', 0, 2),
                        'fec_mes' => $fec_mes_clean,
                        'de_coddes' => '002',
                        'de_desdes' => 'ORDINARIA',
                        'asamblea' => $asamblea,
                        'encargos' => $encargos,
                        'cuota' => $cuotaSindicato,
                        'fondo_mort' => $fondoMort,
                        'credito' => 0.0,
                        'prestamo' => 0.0, // Préstamos comerciales
                        'canasta' => $canasta,
                        'salud' => $salud,
                        'nodes' => 0.0,
                        'otros' => $otros,
                        'de_import' => $totalImportOrd,
                        'observaciones' => 'ORDINARIA',
                        'confirmado' => 0,
                        'sobregiro' => 0.0,
                        'cesante' => $socio->cesante ? 1 : 0,
                        'nombre' => $socio->nombre,
                        'aportefm' => 0.0,
                        'fondom' => $fondom,
                    ]);
                    $countOrd++;
                }
            }

            return [
                'success' => true,
                'fec_mes' => $fec_mes_clean,
                'fondo_fijo_generados' => $countFf,
                'ordinarias_generados' => $countOrd,
            ];
        });
    }

    /**
     * Confirmar planillas y aplicar los aportes/descuentos a los saldos reales de socios (Transacción Atómica).
     * 
     * @param string $fec_mes Fecha del primer día del mes (Y-m-d).
     * @return array
     */
    public function confirm(string $fec_mes): array
    {
        $fec_mes_clean = Carbon::parse($fec_mes)->startOfMonth()->format('Y-m-d');
        
        $startOfMonth = Carbon::parse($fec_mes)->startOfMonth()->format('Y-m-d');
        $endOfMonth = Carbon::parse($fec_mes)->endOfMonth()->format('Y-m-d');

        return DB::transaction(function () use ($fec_mes_clean, $startOfMonth, $endOfMonth) {
            // Verificar si hay planillas para este mes y que no estén ya confirmadas
            $planillasFf = DescFf::where('fec_mes', $fec_mes_clean)->where('confirmado', 0)->get();
            $planillasOrd = DescOrd::where('fec_mes', $fec_mes_clean)->where('confirmado', 0)->get();

            if ($planillasFf->isEmpty() && $planillasOrd->isEmpty()) {
                throw new \Exception("No hay borradores de planillas pendientes de confirmación para el mes especificado.");
            }

            $countAportesFf = 0;
            $countCuotasCobradas = 0;

            // --- 1. PROCESAR CONFIRMACIÓN DE PLANILLA DE FONDO FIJO (desc_ff) ---
            foreach ($planillasFf as $p) {
                $de_codigo = $p->de_codigo;

                // A) Incrementar ahorro en cons_ff (Consolidado Fondo Fijo)
                $consFf = ConsFf::find($de_codigo);
                if (!$consFf) {
                    $consFf = new ConsFf([
                        'de_codigo' => $de_codigo,
                        'nombre' => $p->nombre,
                        'tc' => $p->tc,
                        'socio_ff' => 1,
                        'cesante' => $p->cesante,
                        'saldo' => 0.0,
                        'anterior' => 0.0,
                        'ult_aporte' => 0.0,
                        'fec_aporte' => '1900-01-01',
                        'ult_retiro' => 0.0,
                        'fec_retiro' => '1900-01-01',
                        'actual' => 0.0,
                    ]);
                }
                
                $nuevoActual = $consFf->actual + $p->fondo_ff;
                $consFf->update([
                    'actual' => $nuevoActual,
                    'ult_aporte' => $p->fondo_ff,
                    'fec_aporte' => $fec_mes_clean,
                ]);
                $countAportesFf++;

                // B) Cobrar las cuotas de préstamos financieros agendadas en este mes
                if ($p->prestamo > 0 || $p->interes > 0) {
                    $cuotas = Cuota::where('de_codigo', $de_codigo)
                        ->where('cancelado', 0)
                        ->whereBetween('fecha', [$startOfMonth, $endOfMonth])
                        ->get();

                    foreach ($cuotas as $cuota) {
                        $cuota->update([
                            'cancelado' => 1,
                            'estado' => 'C',
                            'sald_amort' => 0.0,
                            'sald_int' => 0.0,
                            'des_est' => 'CANCELADO',
                            'observacion' => 'PAGO POR PLANILLA ' . Carbon::parse($fec_mes_clean)->format('m/Y'),
                            'usuario' => 'SYSTEM',
                            'fecsuc' => now(),
                        ]);

                        // Restar del saldo capital del Préstamo Master
                        $prestamo = Prestamo::where('pre_codigo', $cuota->pre_codigo)->first();
                        if ($prestamo) {
                            $nuevoSaldo = max(0.0, $prestamo->saldo - $cuota->amortiz);
                            
                            // Verificar si quedan cuotas pendientes para este préstamo
                            $cuotasPendientesRestantes = Cuota::where('pre_codigo', $cuota->pre_codigo)
                                ->where('cancelado', 0)
                                ->count();

                            $cancelado = ($nuevoSaldo <= 0.0 || $cuotasPendientesRestantes === 0) ? 1 : 0;

                            $prestamo->update([
                                'saldo' => $nuevoSaldo,
                                'cancelado' => $cancelado,
                            ]);
                        }

                        // Auditoría de cobro
                        SucFondo::create([
                            'usuario' => 'SYSTEM',
                            'tabla' => 'progpagpf',
                            'fecsuc' => now(),
                            'registro' => $cuota->idpagff,
                            'de_codigo' => $cuota->de_codigo,
                            'pre_codigo' => $cuota->pre_codigo,
                            'monto' => $cuota->pagomes,
                            'fecha' => date('Y-m-d'),
                            'documento' => 'PLANILLA ' . Carbon::parse($fec_mes_clean)->format('m/Y'),
                            'observaciones' => 'PAGO AUTOMÁTICO PLANILLA CUOTA ' . $cuota->ncuota,
                        ]);
                        $countCuotasCobradas++;
                    }
                }
            }

            // --- 2. PROCESAR CONFIRMACIÓN DE PLANILLA ORDINARIA (desc_ord) ---
            foreach ($planillasOrd as $po) {
                // A) Incrementar ahorro en cons_afm (Consolidado Fondo Mortuorio) si tiene fondo_mort
                if ($po->fondo_mort > 0) {
                    $consAfm = ConsAfm::find($po->de_codigo);
                    if (!$consAfm) {
                        $consAfm = new ConsAfm([
                            'de_codigo' => $po->de_codigo,
                            'nombre' => $po->nombre,
                            'tc' => $po->tc,
                            'ult_aporte' => 0.0,
                            'fec_aporte' => '1900-01-01',
                            'ult_retiro' => 0.0,
                            'fec_retiro' => '1900-01-01',
                            'actual' => 0.0,
                        ]);
                    }
                    $nuevoActualAfm = $consAfm->actual + $po->fondo_mort;
                    $consAfm->update([
                        'actual' => $nuevoActualAfm,
                        'ult_aporte' => $po->fondo_mort,
                        'fec_aporte' => $fec_mes_clean,
                    ]);
                }
            }

            // 3. Marcar los borradores del mes como confirmados en la BD
            DescFf::where('fec_mes', $fec_mes_clean)->update([
                'confirmado' => 1,
                'det_confirma' => 'CONFIRMADO',
            ]);
            DescOrd::where('fec_mes', $fec_mes_clean)->update([
                'confirmado' => 1,
            ]);

            return [
                'success' => true,
                'fec_mes' => $fec_mes_clean,
                'aportes_fondo_fijo_aplicados' => $countAportesFf,
                'cuotas_prestamos_cobradas' => $countCuotasCobradas,
            ];
        });
    }
}
