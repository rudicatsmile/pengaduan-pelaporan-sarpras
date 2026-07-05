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

// Helper route for shared hosting to link storage
Route::get('/symlink', function () {
    \Illuminate\Support\Facades\Artisan::call('storage:link');
    return 'Storage linked successfully!';
});

// Public Report Routes (Anonymous)
Route::get('/p/{roomId}', [\App\Http\Controllers\GuestReportController::class, 'showForm'])->name('public.report.form');
Route::post('/p/{roomId}', [\App\Http\Controllers\GuestReportController::class, 'store'])->name('public.report.store');

Route::get('/dashboard', function () {
    $stats = [
        'total' => \App\Models\Report::count(),
        'menunggu' => \App\Models\Report::where('status', 'baru')->count(),
        'diverifikasi' => \App\Models\Report::where('status', 'diverifikasi')->count(),
        'didelegasikan' => \App\Models\Report::where('status', 'didelegasikan')->count(),
        'proses' => \App\Models\Report::where('status', 'dalam_proses')->count(),
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
    Route::post('/reports/{id}/process', [\App\Http\Controllers\Admin\ReportController::class, 'process'])->name('reports.process');
    Route::post('/reports/{id}/resolve', [\App\Http\Controllers\Admin\ReportController::class, 'resolve'])->name('reports.resolve');

    // Analytics Routes
    Route::get('/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/analytics/export', [\App\Http\Controllers\Admin\AnalyticsController::class, 'exportCsv'])->name('analytics.export');

    // Inspection Routes
    Route::get('/inspections', [\App\Http\Controllers\Admin\InspectionController::class, 'index'])->name('inspections.index');
    Route::get('/inspections/{id}', [\App\Http\Controllers\Admin\InspectionController::class, 'show'])->name('inspections.show');
    Route::post('/inspections/{id}/notes', [\App\Http\Controllers\Admin\InspectionController::class, 'updateNotes'])->name('inspections.notes');

    // Asset Inspection Routes
    Route::get('/asset-inspections', [\App\Http\Controllers\Admin\AssetInspectionController::class, 'index'])->name('asset-inspections.index');
    Route::get('/asset-inspections/create', [\App\Http\Controllers\Admin\AssetInspectionController::class, 'create'])->name('asset-inspections.create');
    Route::post('/asset-inspections', [\App\Http\Controllers\Admin\AssetInspectionController::class, 'store'])->name('asset-inspections.store');
    Route::get('/asset-inspections/get-assets', [\App\Http\Controllers\Admin\AssetInspectionController::class, 'getAssets'])->name('asset-inspections.get-assets');
    Route::get('/asset-inspections/{id}', [\App\Http\Controllers\Admin\AssetInspectionController::class, 'show'])->name('asset-inspections.show');

    // Master Data Routes
    Route::resource('floors', \App\Http\Controllers\Admin\FloorController::class);
    Route::resource('rooms', \App\Http\Controllers\Admin\RoomController::class);
    Route::get('rooms/{room}/qr', [\App\Http\Controllers\Admin\RoomController::class, 'generateQr'])->name('rooms.qr');
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
});

require __DIR__.'/auth.php';
