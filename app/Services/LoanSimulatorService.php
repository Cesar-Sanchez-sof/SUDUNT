<?php

namespace App\Services;

use Carbon\Carbon;

class LoanSimulatorService
{
    /**
     * Simular cronograma de pagos según la lógica matemática del sistema legacy.
     * 
     * @param float $principal Monto solicitado del préstamo.
     * @param float $tasa Tasa de interés mensual (en porcentaje, ej: 1.5).
     * @param int $cuotas Número de cuotas/meses.
     * @param string $fechaDesembolso Fecha en formato Y-m-d.
     * @return array
     */
    public function simulate(float $principal, float $tasa, int $cuotas, string $fechaDesembolso): array
    {
        $schedule = [];
        $balance = $principal;
        $totalInterest = 0.0;
        
        // Amortización base: redondeo hacia arriba (ceil) de principal / total cuotas
        $baseAmortization = ceil($principal / $cuotas);
        
        $startDate = Carbon::parse($fechaDesembolso);

        for ($i = 1; $i <= $cuotas; $i++) {
            $paymentDate = $startDate->copy()->addMonths($i)->format('Y-m-d');
            
            // Interés mensual: round(saldo_restante * tasa / 100, 0)
            $interest = round($balance * ($tasa / 100), 0);
            
            // La última cuota absorbe el saldo restante de amortización
            if ($i === $cuotas) {
                $amortization = $balance;
            } else {
                $amortization = min($baseAmortization, $balance);
            }
            
            $previousBalance = $balance;
            $balance = max(0.0, $balance - $amortization);
            $payment = $amortization + $interest;
            
            $totalInterest += $interest;
            
            $schedule[] = [
                'ncuota' => $i,
                'fecha' => $paymentDate,
                'principal' => $previousBalance,
                'amortiz' => $amortization,
                'interes' => $interest,
                'saldo' => $balance,
                'pagomes' => $payment,
            ];
        }

        return [
            'monto' => $principal,
            'tasa' => $tasa,
            'ncuotas' => $cuotas,
            'costfin' => $totalInterest,
            'principal_total' => $principal,
            'total_pago' => $principal + $totalInterest,
            'cronograma' => $schedule,
        ];
    }
}
