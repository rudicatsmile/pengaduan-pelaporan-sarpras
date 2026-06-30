<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ReportController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/rooms/{code}', [RoomController::class, 'show']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);

    Route::get('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'index']);
    Route::post('/tasks/{id}/process', [\App\Http\Controllers\Api\TaskController::class, 'process']);
    Route::post('/tasks/{id}/resolve', [\App\Http\Controllers\Api\TaskController::class, 'resolve']);
});
