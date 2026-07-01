<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\CategoryController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/petugas', [\App\Http\Controllers\Api\PetugasController::class, 'index']);
    
    Route::get('/rooms/{code}', [RoomController::class, 'show']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    
    // Admin & Petugas Action Routes
    Route::post('/reports/{id}/verify', [ReportController::class, 'verify']);
    Route::post('/reports/{id}/delegate', [ReportController::class, 'delegate']);
    Route::post('/reports/{id}/process', [ReportController::class, 'process']);
    Route::post('/reports/{id}/resolve', [ReportController::class, 'resolve']);

    Route::get('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'index']);
    Route::post('/tasks/{id}/process', [\App\Http\Controllers\Api\TaskController::class, 'process']);
    Route::post('/tasks/{id}/resolve', [\App\Http\Controllers\Api\TaskController::class, 'resolve']);
});
