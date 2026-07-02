<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\CategoryController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/settings', [\App\Http\Controllers\SettingController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/user/update', [AuthController::class, 'updateProfile']);
    Route::post('/user/password', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/settings/update', [\App\Http\Controllers\SettingController::class, 'update']);
    Route::post('/settings/logo', [\App\Http\Controllers\SettingController::class, 'uploadLogo']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/petugas', [\App\Http\Controllers\Api\PetugasController::class, 'index']);
    
    Route::get('/buildings', [\App\Http\Controllers\BuildingController::class, 'index']);
    Route::get('/buildings/{buildingId}/floors', [\App\Http\Controllers\FloorController::class, 'getByBuilding']);
    Route::get('/floors/{floorId}/rooms', [RoomController::class, 'getByFloor']);
    
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::get('/rooms/{code}', [RoomController::class, 'show']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    
    // Admin & Petugas Action Routes
    Route::post('/reports/{id}/verify', [ReportController::class, 'verify']);
    Route::post('/reports/{id}/delegate', [ReportController::class, 'delegate']);
    Route::post('/reports/{id}/process', [ReportController::class, 'process']);
    Route::post('/reports/{id}/resolve', [ReportController::class, 'resolve']);

    // Inspection Routes
    Route::get('/inspections', [\App\Http\Controllers\Api\InspectionController::class, 'index']);
    Route::post('/inspections', [\App\Http\Controllers\Api\InspectionController::class, 'store']);
    Route::get('/inspections/{id}', [\App\Http\Controllers\Api\InspectionController::class, 'show']);

    Route::get('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'index']);
    Route::post('/tasks/{id}/process', [\App\Http\Controllers\Api\TaskController::class, 'process']);
    Route::post('/tasks/{id}/resolve', [\App\Http\Controllers\Api\TaskController::class, 'resolve']);
});
