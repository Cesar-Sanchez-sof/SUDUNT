<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use App\Models\Prestamo;
use App\Models\Cuota;
use App\Models\SucFondo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CobroController extends Controller
{
    /**
     * Mostrar la interfaz de cobro en caja.
     */
    public function index(Request $request): Response
    {
        $de_codigo = $request->input('de_codigo');
        $socio = null;
        $cuotasPendientes = [];

        if ($de_codigo) {
            $socio = Socio::find($de_codigo);
            if ($socio) {
                // Obtener todas las cuotas de préstamos financieros pendientes
                $cuotasPendientes = Cuota::where('de_codigo', $de_codigo)
                    ->where('cancelado', 0)
                    ->orderBy('pre_codigo')
                    ->orderBy('ncuota')
                    ->get();
            }
        }

        // Obtener lista de socios que tienen deudas (préstamos con saldo > 0)
        $sociosConDeudaIds = Prestamo::where('saldo', '>', 0)
            ->distinct()
            ->pluck('de_codigo');

        $sociosList = Socio::whereIn('de_codigo', $sociosConDeudaIds)
            ->select('de_codigo', 'nombre', 'dni')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Cobros/Caja', [
            'socio' => $socio,
            'cuotasPendientes' => $cuotasPendientes,
            'sociosList' => $sociosList,
            'filters' => $request->only(['de_codigo']),
        ]);
    }

    /**
     * Registrar el cobro de una cuota (Transacción Atómica).
     */
    public function pagar(Request $request): RedirectResponse
    {
        $request->validate([
            'idpagff' => 'required|exists:progpagpf,idpagff',
            'documento' => 'required|string|max:50',
            'observaciones' => 'nullable|string|max:70',
        ]);

        $idpagff = $request->input('idpagff');
        $documento = $request->input('documento');
        $observacionesInput = $request->input('observaciones');

        DB::transaction(function () use ($idpagff, $documento, $observacionesInput) {
            // 1. Obtener y actualizar la cuota
            $cuota = Cuota::findOrFail($idpagff);
            
            $cuota->update([
                'cancelado' => 1,
                'estado' => 'C',
                'sald_amort' => 0.0,
                'sald_int' => 0.0,
                'des_est' => 'CANCELADO',
                'observacion' => $observacionesInput ?? 'COBRADO EN CAJA',
                'usuario' => substr(auth()->user()->nom_usuario ?? 'ADMIN', 0, 10),
                'fecsuc' => now(),
            ]);

            // 2. Obtener y actualizar el Préstamo Master
            $prestamo = Prestamo::where('pre_codigo', $cuota->pre_codigo)->first();
            if ($prestamo) {
                // Restar la amortización pagada al saldo capital restante
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

            // 3. Registrar auditoría en suc_fondo
            SucFondo::create([
                'usuario' => substr(auth()->user()->nom_usuario ?? 'ADMIN', 0, 10),
                'tabla' => 'progpagpf',
                'fecsuc' => now(),
                'registro' => $cuota->idpagff,
                'de_codigo' => $cuota->de_codigo,
                'pre_codigo' => $cuota->pre_codigo,
                'monto' => $cuota->pagomes, // Monto total pagado (capital + interés)
                'fecha' => date('Y-m-d'),
                'documento' => $documento,
                'observaciones' => $observacionesInput ?? 'PAGO CUOTA ' . $cuota->ncuota,
            ]);
        });

        return redirect()->route('cobros.index', ['de_codigo' => $request->input('de_codigo')])
            ->with('success', 'Pago de cuota registrado correctamente.');
    }
}
