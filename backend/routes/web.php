<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/dashboard', function () {
    $stats = [
        'total' => \App\Models\Report::count(),
        'menunggu' => \App\Models\Report::where('status', 'menunggu')->count(),
        'diverifikasi' => \App\Models\Report::where('status', 'diverifikasi')->count(),
        'didelegasikan' => \App\Models\Report::where('status', 'didelegasikan')->count(),
        'proses' => \App\Models\Report::where('status', 'proses')->count(),
        'selesai' => \App\Models\Report::where('status', 'selesai')->count(),
        'ditolak' => \App\Models\Report::where('status', 'ditolak')->count(),
    ];
    return Inertia::render('Dashboard', [
        'stats' => $stats
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Admin Report Routes
    Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{id}', [\App\Http\Controllers\Admin\ReportController::class, 'show'])->name('reports.show');
    Route::post('/reports/{id}/verify', [\App\Http\Controllers\Admin\ReportController::class, 'verify'])->name('reports.verify');
    Route::post('/reports/{id}/delegate', [\App\Http\Controllers\Admin\ReportController::class, 'delegate'])->name('reports.delegate');
});

require __DIR__.'/auth.php';
