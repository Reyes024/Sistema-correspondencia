<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CorrespondenciaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren token de Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('correspondencias', CorrespondenciaController::class)->except(['update', 'destroy']);
    Route::post('/correspondencias/{correspondencia}/distribuir', [CorrespondenciaController::class, 'distribuir']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/usuarios', [UserController::class, 'index']);
    Route::get('/usuarios/reporte', [UserController::class, 'reporte']);
    Route::post('/usuarios', [UserController::class, 'store']);
    Route::put('/usuarios', [UserController::class, 'update']);
    Route::delete('/usuarios/{user}', [UserController::class, 'destroy']);

    Route::get('/areas', function () {
        return response()->json(\App\Models\Area::all());
    });
});