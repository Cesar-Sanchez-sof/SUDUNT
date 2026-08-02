<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SocioController;
use App\Http\Controllers\PrestamoController;
use App\Http\Controllers\CobroController;
use App\Http\Controllers\PlanillaController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Módulo de Socios
    Route::get('/socios', [SocioController::class, 'index'])->name('socios.index');
    Route::get('/socios/{de_codigo}', [SocioController::class, 'show'])->name('socios.show');

    // Módulo de Préstamos
    Route::get('/prestamos/simular', [PrestamoController::class, 'simular'])->name('prestamos.simular');
    Route::post('/prestamos', [PrestamoController::class, 'store'])->name('prestamos.store');

    // Módulo de Cobros
    Route::get('/cobros', [CobroController::class, 'index'])->name('cobros.index');
    Route::post('/cobros/pagar', [CobroController::class, 'pagar'])->name('cobros.pagar');

    // Módulo de Planillas
    Route::get('/planillas', [PlanillaController::class, 'index'])->name('planillas.index');
    Route::post('/planillas/generar', [PlanillaController::class, 'generar'])->name('planillas.generar');
    Route::post('/planillas/confirmar', [PlanillaController::class, 'confirmar'])->name('planillas.confirmar');
});

require __DIR__.'/auth.php';
